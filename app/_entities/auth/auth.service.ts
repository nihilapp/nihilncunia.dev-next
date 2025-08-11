import { userMessage } from '@/_data';
import type { SignUpData, SignInData, AuthResult } from '@/_entities/auth';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { UserService } from '@/_entities/users/users.service';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

export class AuthService {
  /**
   * 사용자 회원가입
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
          role: signUpData.role,
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
          message: userMessage.userNotFound,
        };
      }

      const isPasswordValid = await BcryptHelper
        .dataCompare(signInData.password, findUser.data.password_hash);

      if (!isPasswordValid) {
        return {
          data: null,
          message: userMessage.currentPasswordIncorrect,
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
            message: '사용자를 찾을 수 없습니다.',
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
          message: '세션이 만료되었습니다.',
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
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      Logger.userAction('TOKEN_REFRESH', user.id, { email: user.email, });

      return {
        data: {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: '토큰이 갱신되었습니다.',
      };
    }
    catch (error) {
      Logger.error('SESSION_VERIFICATION_ERROR', error);

      return {
        data: null,
        message: '세션 검증 중 오류가 발생했습니다.',
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
        message: '로그아웃되었습니다.',
      };
    }
    catch (error) {
      Logger.error('USER_SIGNOUT_ERROR', error);

      return {
        data: false,
        message: '로그아웃 중 오류가 발생했습니다.',
      };
    }
  }
}
