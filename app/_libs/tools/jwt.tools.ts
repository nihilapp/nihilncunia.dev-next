import { jwtVerify, SignJWT } from 'jose';

import { getServerConfig } from '@/_libs/tools/config.loader';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

const app = await getServerConfig();

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  iss?: string;
  aud?: string;
}

interface TokenInfo {
  payload: JwtPayload | null;
  expiresAt: number;
  isExpired: boolean;
  remainingTime: number; // 남은 시간 (밀리초)
}

interface ValidationResult {
  isValid: boolean;
  user?: TokenPayload | null;
  error?: string;
}

export class JwtHelper {
  /**
   * 토큰 생성 (액세스 토큰, 리프레시 토큰)
   * @param payload - 토큰 페이로드
   * @returns 액세스 토큰, 리프레시 토큰
   */
  static async genTokens(payload: TokenPayload) {
    const {
      access_secret,
      refresh_secret,
      access_token_exp,
      refresh_token_exp,
    } = app.server.jwt;

    const accessToken = await new SignJWT({ ...payload, })
      .setProtectedHeader({ alg: 'HS256', })
      .setExpirationTime(access_token_exp)
      .sign(new TextEncoder().encode(access_secret));

    const refreshToken = await new SignJWT({ ...payload, })
      .setProtectedHeader({ alg: 'HS256', })
      .setExpirationTime(refresh_token_exp)
      .sign(new TextEncoder().encode(refresh_secret));

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 토큰 검증 (저장된 사용자 정보와 비교)
   * @param token - 검증할 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 검증 결과
   */
  static async verifyWithUser(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<ValidationResult> {
    try {
      // 1. JWT 토큰 검증
      const payload = await this.verify(token, type);

      // 2. 사용자가 데이터베이스에 존재하는지 확인
      const user = await PrismaHelper.user.getUser(payload.id);

      if (!user) {
        return {
          isValid: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      // 3. 계정이 활성화되어 있는지 확인
      if (!user.is_active) {
        return {
          isValid: false,
          error: '비활성화된 계정입니다.',
        };
      }

      // 4. 토큰의 정보와 데이터베이스 정보가 일치하는지 확인
      if (user.email !== payload.email || user.role !== payload.role) {
        return {
          isValid: false,
          error: '토큰 정보가 일치하지 않습니다.',
        };
      }

      return {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    }
    catch (error) {
      console.error('토큰 검증 실패', error);
      return {
        isValid: false,
        error: '토큰이 유효하지 않습니다.',
      };
    }
  }

  /**
   * 토큰 검증 (기본 JWT 검증만)
   * @param token - 검증할 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 토큰 페이로드
   */
  static async verify(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<JwtPayload> {
    const secret = type === 'access'
      ? app.server.jwt.access_secret
      : app.server.jwt.refresh_secret;

    const { payload, } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: [ 'HS256', ],
      }
    );

    return payload as unknown as JwtPayload;
  }

  /**
   * 토큰 정보 분석 (만료 시간, 남은 시간 등)
   * @param token - 분석할 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 토큰 정보
   */
  static async analyzeToken(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<TokenInfo> {
    try {
      const payload = await this.verify(token, type);
      const expiresAt = payload.exp * 1000; // 초를 밀리초로 변환
      const now = Date.now();
      const remainingTime = expiresAt - now;
      const isExpired = remainingTime <= 0;

      return {
        payload,
        expiresAt,
        isExpired,
        remainingTime: Math.max(0, remainingTime),
      };
    }
    catch (error) {
      console.error('토큰 검증 실패', error);
      // 토큰이 유효하지 않은 경우
      return {
        payload: null,
        expiresAt: 0,
        isExpired: true,
        remainingTime: 0,
      };
    }
  }

  /**
   * 토큰 만료 시간 체크
   * @param token - 체크할 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 만료까지 남은 시간 (밀리초), 만료되었으면 0
   */
  static async getRemainingTime(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<number> {
    const tokenInfo = await this.analyzeToken(token, type);
    return tokenInfo.remainingTime;
  }

  /**
   * 토큰이 만료되었는지 체크
   * @param token - 체크할 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 만료 여부
   */
  static async isExpired(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<boolean> {
    const tokenInfo = await this.analyzeToken(token, type);
    return tokenInfo.isExpired;
  }

  /**
   * 액세스 토큰이 만료되었을 때 새로운 토큰 발급 (사용자 검증 포함)
   * @param accessToken - 현재 액세스 토큰
   * @param refreshToken - 리프레시 토큰
   * @returns 새로운 액세스 토큰, 리프레시 토큰 (실패시 null)
   */
  static async refreshTokensWithValidation(
    accessToken: string,
    refreshToken: string
  ) {
    try {
      // 리프레시 토큰 검증 (사용자 정보 포함)
      const refreshValidation = await this.verifyWithUser(refreshToken, 'refresh');
      if (!refreshValidation.isValid || !refreshValidation.user) {
        return null;
      }

      // 액세스 토큰이 만료되었는지 확인
      const accessTokenInfo = await this.analyzeToken(accessToken, 'access');

      if (!accessTokenInfo.isExpired) {
        // 액세스 토큰이 아직 유효한 경우
        return {
          accessToken,
          refreshToken,
          refreshed: false,
        };
      }

      // 새로운 토큰 발급
      const newTokens = await this.genTokens(refreshValidation.user);

      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        refreshed: true,
      };
    }
    catch (error) {
      console.error('토큰 새로고침 실패', error);
      // 리프레시 토큰이 유효하지 않은 경우
      return null;
    }
  }

  /**
   * 액세스 토큰이 만료되었을 때 새로운 토큰 발급 (기본)
   * @param accessToken - 현재 액세스 토큰
   * @param refreshToken - 리프레시 토큰
   * @returns 새로운 액세스 토큰, 리프레시 토큰 (실패시 null)
   */
  static async refreshTokens(
    accessToken: string,
    refreshToken: string
  ) {
    try {
      // 리프레시 토큰 검증
      const refreshPayload = await this.verify(refreshToken, 'refresh');

      // 액세스 토큰이 만료되었는지 확인
      const accessTokenInfo = await this.analyzeToken(accessToken, 'access');

      if (!accessTokenInfo.isExpired) {
        // 액세스 토큰이 아직 유효한 경우
        return {
          accessToken,
          refreshToken,
          refreshed: false,
        };
      }

      // 새로운 토큰 발급
      const newTokens = await this.genTokens({
        id: refreshPayload.id,
        email: refreshPayload.email,
        role: refreshPayload.role,
      });

      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        refreshed: true,
      };
    }
    catch (error) {
      console.error('토큰 새로고침 실패', error);
      // 리프레시 토큰이 유효하지 않은 경우
      return null;
    }
  }

  /**
   * 토큰에서 사용자 정보 추출 (검증 포함)
   * @param token - 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 사용자 정보
   */
  static async extractUserInfoWithValidation(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<TokenPayload | null> {
    try {
      const validation = await this.verifyWithUser(token, type);
      return validation.isValid
        ? validation.user || null
        : null;
    }
    catch (error) {
      console.error('사용자 정보 추출 실패', error);
      return null;
    }
  }

  /**
   * 토큰에서 사용자 정보 추출 (기본)
   * @param token - 토큰
   * @param type - 토큰 타입 (access, refresh)
   * @returns 사용자 정보
   */
  static async extractUserInfo(
    token: string,
    type: 'access' | 'refresh'
  ): Promise<TokenPayload | null> {
    try {
      const payload = await this.verify(token, type);
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    }
    catch (error) {
      console.error('사용자 정보 추출 실패', error);
      return null;
    }
  }

  /**
   * 토큰 만료 시간을 사람이 읽기 쉬운 형태로 변환
   * @param remainingTime - 남은 시간 (밀리초)
   * @returns 읽기 쉬운 형태의 시간
   */
  static formatRemainingTime(remainingTime: number): string {
    if (remainingTime <= 0) {
      return '만료됨';
    }

    const seconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}일 ${hours % 24}시간`;
    }
    else if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분`;
    }
    else if (minutes > 0) {
      return `${minutes}분 ${seconds % 60}초`;
    }
    else {
      return `${seconds}초`;
    }
  }
}
