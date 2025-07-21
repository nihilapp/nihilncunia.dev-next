import { jwtVerify, SignJWT } from 'jose';

import { User } from '@/_prisma/client';
import {
  type TokenMode,
  type TokenData,
  type Tokens
} from '@/_types';

/**
 * JWT 토큰 헬퍼
 * - 토큰 생성, 검증, 만료 체크 등 인증 관련 유틸리티
 */
export class JwtTokenHelper {
  /**
   * 비밀 키를 TextEncoder로 인코딩
   */
  static async setSecret(secret: string) {
    return new TextEncoder().encode(secret);
  }

  /**
   * 토큰 생성
   */
  static async genTokens(user: User): Promise<Tokens> {
    const { id, email, role, } = user;

    const tokenPayload = {
      id,
      email,
      role,
    };

    const accessTokenSecret = await this.setSecret(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!);
    const refreshTokenSecret = await this.setSecret(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!);

    const accessToken = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256', })
      .setIssuedAt()
      .setExpirationTime(process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_TIME)
      .sign(accessTokenSecret);

    const refreshToken = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256', })
      .setIssuedAt()
      .setExpirationTime(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_TIME)
      .sign(refreshTokenSecret);

    // 실제 만료 시간(exp) 추출
    const accessTokenInfo = await this.tokenInfo('accessToken', accessToken);
    const refreshTokenInfo = await this.tokenInfo('refreshToken', refreshToken);

    return {
      accessToken: {
        token: accessToken,
        exp: accessTokenInfo.exp,
      },
      refreshToken: {
        token: refreshToken,
        exp: refreshTokenInfo.exp,
      },
    };
  }

  /**
   * 토큰 정보(페이로드) 조회 및 검증
   */
  static async tokenInfo(
    mode: TokenMode,
    token: string
  ): Promise<TokenData> {
    const secretString = mode === 'accessToken'
      ? process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET
      : process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET;

    if (!secretString) {
      throw new Error('JWT 시크릿이 설정되지 않았습니다.');
    }

    const secret = await this.setSecret(secretString);

    try {
      const { payload, } = await jwtVerify(
        token,
        secret,
        {
          algorithms: [ 'HS256', ],
        }
      );

      return payload as unknown as TokenData;
    }
    catch (error: any) {
      console.error(
        `${mode} 토큰 검증 실패:`,
        error.message
      );

      throw new Error(`${mode} 토큰이 유효하지 않습니다.`);
    }
  }

  /**
   * 토큰 만료까지 남은 시간(초)
   */
  static expCheck(expTime: number): number {
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.floor(expTime) - now;
    return diff;
  }
}
