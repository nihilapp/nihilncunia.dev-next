import { authMessage, userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import type { UserServiceType } from '@/_entities/users/service/user.service.interface';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { CommonHelper } from '@/_libs/tools/common.tools';
import { EmailHelper } from '@/_libs/tools/email.tools';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import type { AdminVerificationCode } from '@/_prisma';

import type {
  SignInData,
  AuthResult
} from '../auth.types';
import type { AuthDaoType } from '../dao/auth.dao.interface';

import type { AuthServiceType } from './auth.service.interface';

/**
 * Auth 도메인의 Service 레이어 구현체
 * AuthServiceType 인터페이스를 구현하여 실제 비즈니스 로직을 처리
 * AuthDao와 UserService를 의존성 주입받아 순수한 인증 로직만 담당
 */
export class AuthService implements AuthServiceType {
  /**
   * AuthService 생성자
   * @param authDao AuthDao 인스턴스 (의존성 주입)
   * @param userService UserService 인스턴스 (의존성 주입)
   */
  constructor(
    private authDao: AuthDaoType,
    private userService: UserServiceType
  ) {}

  /**
   * 사용자 로그인
   * 이메일/비밀번호 검증 후 JWT 토큰 발급 및 리프레시 토큰 저장
   * @param signInData 로그인 데이터 (이메일, 비밀번호)
   * @returns PrismaReturn<AuthResult | null> 사용자 정보와 토큰
   */
  async signIn(signInData: SignInData): PrismaReturn<AuthResult | null> {
    try {
      const userResult = await this.userService.getUserByEmailWithPassword(signInData.email);
      const findUser = userResult.data;

      if (!findUser) {
        return {
          data: null,
          message: authMessage.invalidCredentials,
        };
      }

      const isPasswordValid = await BcryptHelper.dataCompare(
        findUser.password_hash,
        signInData.password
      );

      if (!isPasswordValid) {
        return {
          data: null,
          message: authMessage.invalidCredentials,
        };
      }

      // 비밀번호를 제외한 사용자 정보
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = findUser;

      // JWT 토큰 생성
      const { accessToken, refreshToken, } = await JwtHelper.genTokens({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      });

      // 리프레시 토큰을 데이터베이스에 저장
      await this.userService.updateRefreshToken(findUser.id, refreshToken);

      Logger.userAction('USER_SIGNIN', findUser.id, { email: findUser.email, });

      return {
        data: {
          user: userWithoutPassword as UserWithOmitPassword,
          accessToken,
          refreshToken,
        },
        message: userMessage.getDetailSuccess,
      };
    }
    catch (error) {
      Logger.error('USER_SIGNIN_ERROR', error);

      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  /**
   * 사용자 로그아웃
   * 리프레시 토큰을 데이터베이스에서 제거하여 로그아웃 처리
   * @param userId 사용자 ID
   * @returns PrismaReturn<boolean> 로그아웃 성공 여부
   */
  async signOut(userId: string): PrismaReturn<boolean> {
    try {
      // 리프레시 토큰을 데이터베이스에서 제거
      await this.userService.updateRefreshToken(userId, null);

      Logger.userAction('USER_SIGNOUT', userId);

      return {
        data: true,
        message: authMessage.signoutSuccess,
      };
    }
    catch (error) {
      Logger.error('USER_SIGNOUT_ERROR', error);

      return {
        data: false,
        message: authMessage.signoutError,
      };
    }
  }

  /**
   * 비밀번호 재설정 요청 (토큰 기반)
   * 사용자 이메일로 재설정 토큰 생성 후 이메일 발송
   * @param email 사용자 이메일
   * @returns PrismaReturn<boolean> 이메일 발송 성공 여부
   */
  async requestPasswordReset(email: string): PrismaReturn<boolean> {
    try {
      const userResult = await this.userService.getUserByEmail(email);
      const findUser = userResult.data;

      if (!findUser) {
        // 보안: 존재하지 않는 이메일도 성공으로 응답하여 이메일 존재 여부 추측 방지
        return {
          data: true,
          message: authMessage.resetPasswordLinkSent,
        };
      }

      // 기존 토큰들 모두 무효화
      await this.authDao.invalidateAllPasswordResetTokens(findUser.id);

      // 재설정 토큰 생성 (UUID 사용)
      const resetToken = CommonHelper.uuid();
      const tokenHash = await BcryptHelper.dataToHash(resetToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15분 후 만료

      await this.authDao.createPasswordResetToken(findUser.id, tokenHash, expiresAt);

      // 이메일로 임시 비밀번호 발송 (기존 호환성 유지)
      await EmailHelper.sendTemporaryPassword(email, resetToken);

      Logger.userAction('PASSWORD_RESET_REQUESTED', findUser.id, { email, });

      return {
        data: true,
        message: authMessage.resetPasswordLinkSent,
      };
    }
    catch (error) {
      Logger.error('REQUEST_PASSWORD_RESET_ERROR', error);
      return {
        data: false,
        message: authMessage.resetPasswordError,
      };
    }
  }

  /**
   * 비밀번호 재설정 실행 (토큰 기반)
   * 토큰 검증 후 새로운 비밀번호로 변경
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   * @returns PrismaReturn<boolean> 비밀번호 변경 성공 여부
   */
  async resetPassword(token: string, newPassword: string): PrismaReturn<boolean> {
    try {
      const tokenHash = await BcryptHelper.dataToHash(token);
      const validToken = await this.authDao.findValidPasswordResetTokenByHash(tokenHash);

      if (!validToken || validToken.used || new Date() > validToken.expires_at) {
        return {
          data: false,
          message: authMessage.invalidOrExpiredToken,
        };
      }

      // 새 비밀번호 해시 및 업데이트
      const newPasswordHash = await BcryptHelper.dataToHash(newPassword);
      await this.userService.updatePassword(validToken.user_id, newPasswordHash);

      // 토큰을 사용됨으로 표시
      await this.authDao.markPasswordResetTokenAsUsed(validToken.id);

      Logger.userAction('PASSWORD_RESET_COMPLETED', validToken.user_id);

      return {
        data: true,
        message: authMessage.resetPasswordSuccess,
      };
    }
    catch (error) {
      Logger.error('RESET_PASSWORD_ERROR', error);
      return {
        data: false,
        message: authMessage.resetPasswordError,
      };
    }
  }

  /**
   * 세션 검증 및 토큰 갱신
   * 액세스 토큰과 리프레시 토큰을 검증하여 세션 유효성 확인
   * 필요 시 새로운 토큰 발급 및 사용자 정보 반환
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   * @returns PrismaReturn<AuthResult | null> 검증 결과 및 새로운 토큰
   */
  async verifySession(
    accessToken: string,
    refreshToken: string
  ): PrismaReturn<AuthResult | null> {
    try {
      // 액세스 토큰 검증
      const accessValidation = await JwtHelper.verifyWithUser(accessToken, 'access');

      if (accessValidation.isValid && accessValidation.user) {
        // 액세스 토큰이 유효한 경우
        const userResult = await this.userService.getUserById(accessValidation.user.id);
        const user = userResult.data;

        if (!user) {
          return {
            data: null,
            message: userMessage.userNotFound,
          };
        }

        return {
          data: { user, },
          message: '세션이 유효합니다.',
        };
      }

      // 액세스 토큰이 만료된 경우, 리프레시 토큰으로 갱신 시도
      const refreshValidation = await JwtHelper.verifyWithUser(refreshToken, 'refresh');

      if (!refreshValidation.isValid || !refreshValidation.user) {
        return {
          data: null,
          message: authMessage.sessionExpired,
        };
      }

      // 새로운 토큰 발급
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, }
        = await JwtHelper.genTokens({
          id: refreshValidation.user.id,
          email: refreshValidation.user.email,
          role: refreshValidation.user.role,
        });

      // 리프레시 토큰을 데이터베이스에 업데이트
      await this.userService.updateRefreshToken(refreshValidation.user.id, newRefreshToken);

      // 사용자 정보 조회
      const userResult = await this.userService.getUserById(refreshValidation.user.id);
      const user = userResult.data;

      if (!user) {
        return {
          data: null,
          message: userMessage.userNotFound,
        };
      }

      Logger.userAction('TOKEN_REFRESH', user.id, { email: user.email, });

      return {
        data: {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: authMessage.tokenRefreshSuccess,
      };
    }
    catch (error) {
      Logger.error('SESSION_VERIFICATION_ERROR', error);

      return {
        data: null,
        message: authMessage.sessionVerificationError,
      };
    }
  }

  /**
   * 관리자 인증 코드 생성 및 발송
   * 6자리 숫자 코드를 생성하여 해시 후 저장, 이메일로 발송
   * @param ipAddress 요청한 IP 주소 (선택사항)
   * @returns PrismaReturn<boolean> 인증 코드 발송 성공 여부
   */
  async createAdminVerification(ipAddress?: string): PrismaReturn<boolean> {
    try {
      // 기존 유효한 관리자 인증 코드들을 모두 무효화
      await this.authDao.invalidateAllAdminVerificationCodes();

      // 6자리 숫자 인증 코드 생성
      const code = Math.random().toString().substring(2, 8);

      // 코드 해시
      const codeHash = await BcryptHelper.dataToHash(code);

      // 만료 시간 설정 (10분)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 데이터베이스에 저장
      await this.authDao.createAdminVerificationCode(codeHash, expiresAt, ipAddress);

      // 개발 환경에서 로깅
      if (process.env.NODE_ENV === 'development') {
        Logger.info('ADMIN_VERIFICATION', '인증 코드 생성 시작', {
          code,
          expiresAt,
        });
      }

      // 설정 파일의 to 필드로 이메일 발송
      await EmailHelper.sendVerificationCode(code);

      // 개발 환경에서 로깅
      if (process.env.NODE_ENV === 'development') {
        Logger.info('ADMIN_VERIFICATION', '인증 코드 이메일 발송 완료');
      }

      return {
        data: true,
        message: authMessage.adminVerificationCodeSent,
      };
    }
    catch (error) {
      Logger.error('ADMIN_VERIFICATION', '인증 코드 생성 실패', error);
      return {
        data: false,
        message: authMessage.adminVerificationCodeError,
      };
    }
  }

  /**
   * 관리자 인증 코드 검증
   * 입력된 코드를 해시하여 데이터베이스의 유효한 코드와 비교
   * @param code 사용자가 입력한 6자리 인증 코드
   * @returns PrismaReturn<boolean> 인증 성공 여부
   */
  async verifyAdminCode(code: string): PrismaReturn<boolean> {
    try {
      // 개발 환경에서는 콘솔에 인증 코드 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 [개발환경] 인증 코드 검증 요청:', code);
      }

      // 현재는 코드가 6자리 숫자인지만 확인
      if (!/^\d{6}$/.test(code)) {
        return {
          data: false,
          message: '인증 코드는 6자리 숫자여야 합니다.',
        };
      }

      // 유효한 인증 코드들 조회
      const validCodes = await this.authDao.findValidAdminVerificationCodes();

      if (validCodes.length === 0) {
        return {
          data: false,
          message: '유효한 인증 코드가 없습니다.',
        };
      }

      // 입력된 코드와 일치하는 해시 찾기
      let matchedCode: AdminVerificationCode | null = null;

      for (const validCode of validCodes) {
        const isValidCode = await BcryptHelper.dataCompare(validCode.code_hash, code);
        if (isValidCode) {
          matchedCode = validCode;
          break;
        }
      }

      if (!matchedCode) {
        return {
          data: false,
          message: '유효하지 않은 인증 코드입니다.',
        };
      }

      // 인증 코드를 사용됨으로 표시
      await this.authDao.markAdminVerificationCodeAsUsed(matchedCode.id);

      Logger.userAction('ADMIN_VERIFICATION_SUCCESS', 'system', {
        codeId: matchedCode.id,
        ipAddress: matchedCode.ip_address,
      });

      return {
        data: true,
        message: authMessage.adminVerificationSuccess,
      };
    }
    catch (error) {
      Logger.error('ADMIN_VERIFICATION_VERIFY_ERROR', error);
      return {
        data: false,
        message: authMessage.adminVerificationError,
      };
    }
  }
}
