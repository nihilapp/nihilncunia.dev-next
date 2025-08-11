import { authMessage, userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { UserService } from '@/_entities/users/users.service';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { EmailHelper } from '@/_libs/tools/email.tools';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

import type { SignUpData, SignInData, AuthResult, AdminSignUpData } from './auth.types';

export class AuthService {
  /**
   * 일반 사용자 회원가입
   * @param signUpData 사용자 생성 정보
   * @returns 사용자
   */
  static async signUp(signUpData: SignUpData): PrismaReturn<UserWithOmitPassword | null> {
    try {
      const findUser = await UserService.getUserByEmail(signUpData.email);

      if (findUser.data) {
        return {
          data: null,
          message: userMessage.emailAlreadyExists,
        };
      }

      const hashedPassword = await BcryptHelper
        .dataToHash(signUpData.password);

      const user = await PrismaHelper.client.user.create({
        data: {
          email: signUpData.email,
          username: signUpData.username,
          password_hash: hashedPassword,
          role: 'USER', // 일반 회원가입은 항상 USER로 고정
        },
        omit: {
          password_hash: true,
          refresh_token: true,
        },
      });

      Logger.userAction('USER_SIGNUP', user.id, { email: user.email, });

      return {
        data: user,
        message: userMessage.createSuccess,
      };
    }
    catch (error) {
      Logger.error('USER_SIGNUP_ERROR', error);

      return {
        data: null,
        message: userMessage.createError,
      };
    }
  }

  /**
   * 관리자 회원가입
   * @param signUpData 관리자 생성 정보
   * @returns 사용자
   */
  static async signUpAdmin(signUpData: AdminSignUpData): PrismaReturn<UserWithOmitPassword | null> {
    try {
      const findUser = await UserService.getUserByEmail(signUpData.email);

      if (findUser.data) {
        return {
          data: null,
          message: userMessage.emailAlreadyExists,
        };
      }

      const hashedPassword = await BcryptHelper
        .dataToHash(signUpData.password);

      const user = await PrismaHelper.client.user.create({
        data: {
          email: signUpData.email,
          username: signUpData.username,
          password_hash: hashedPassword,
          role: 'ADMIN',
        },
        omit: {
          password_hash: true,
          refresh_token: true,
        },
      });

      Logger.userAction('ADMIN_SIGNUP', user.id, { email: user.email, });

      return {
        data: user,
        message: userMessage.createSuccess,
      };
    }
    catch (error) {
      Logger.error('ADMIN_SIGNUP_ERROR', error);

      return {
        data: null,
        message: userMessage.createError,
      };
    }
  }

  /**
   * 관리자 인증 코드 생성 및 발송
   * @returns 성공 여부
   */
  static async createAdminVerification(): PrismaReturn<boolean> {
    try {
      const code = Math.random().toString().substring(2, 8);

      // 개발 환경에서 로깅
      if (process.env.NODE_ENV === 'development') {
        Logger.info('ADMIN_VERIFICATION', '인증 코드 생성 시작', {
          code,
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
   * @param code - 사용자가 입력한 코드
   * @returns 성공 여부
   */
  static async verifyAdminCode(code: string): PrismaReturn<boolean> {
    try {
      // 개발 환경에서는 콘솔에 인증 코드 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 [개발환경] 인증 코드 검증 요청:', code);
      }

      // 현재는 단순히 코드가 6자리 숫자인지만 확인
      if (!/^\d{6}$/.test(code)) {
        return {
          data: false,
          message: '인증 코드는 6자리 숫자여야 합니다.',
        };
      }

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

  /**
   * 사용자 로그인
   * @param signInData 사용자 로그인 정보
   * @returns 사용자 및 토큰
   */
  static async signIn(signInData: SignInData): PrismaReturn<AuthResult | null> {
    try {
      const findUser = await UserService.getUserByEmailWithPassword(signInData.email);

      if (!findUser.data) {
        return {
          data: null,
          message: authMessage.invalidCredentials,
        };
      }

      const isPasswordValid = await BcryptHelper
        .dataCompare(findUser.data.password_hash, signInData.password);

      if (!isPasswordValid) {
        return {
          data: null,
          message: authMessage.invalidCredentials,
        };
      }

      // 비밀번호를 제외한 사용자 정보
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = findUser.data;

      // JWT 토큰 생성
      const { accessToken, refreshToken, } = await JwtHelper.genTokens({
        id: findUser.data.id,
        email: findUser.data.email,
        role: findUser.data.role,
      });

      // 리프레시 토큰을 데이터베이스에 저장
      await PrismaHelper.client.user.update({
        where: { id: findUser.data.id, },
        data: { refresh_token: refreshToken, },
      });

      Logger.userAction('USER_SIGNIN', findUser.data.id, { email: findUser.data.email, });

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
   * 세션 검증 및 토큰 갱신
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   * @returns 사용자 정보 및 새로운 토큰 (필요시)
   */
  static async verifySession(accessToken: string, refreshToken: string): PrismaReturn<AuthResult | null> {
    try {
      // 액세스 토큰 검증
      const accessValidation = await JwtHelper.verifyWithUser(accessToken, 'access');

      if (accessValidation.isValid && accessValidation.user) {
        // 액세스 토큰이 유효한 경우
        const user = await PrismaHelper.client.user.findUnique({
          where: { id: accessValidation.user.id, },
          omit: {
            password_hash: true,
            refresh_token: true,
          },
        });

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
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, } = await JwtHelper.genTokens({
        id: refreshValidation.user.id,
        email: refreshValidation.user.email,
        role: refreshValidation.user.role,
      });

      // 리프레시 토큰을 데이터베이스에 업데이트
      await PrismaHelper.client.user.update({
        where: { id: refreshValidation.user.id, },
        data: { refresh_token: newRefreshToken, },
      });

      // 사용자 정보 조회
      const user = await PrismaHelper.client.user.findUnique({
        where: { id: refreshValidation.user.id, },
        omit: {
          password_hash: true,
          refresh_token: true,
        },
      });

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
   * 사용자 로그아웃
   * @param userId 사용자 ID
   * @returns 성공 여부
   */
  static async signOut(userId: string): PrismaReturn<boolean> {
    try {
      // 리프레시 토큰을 데이터베이스에서 제거
      await PrismaHelper.client.user.update({
        where: { id: userId, },
        data: { refresh_token: null, },
      });

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
}
