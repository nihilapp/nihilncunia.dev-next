import { userMessage } from '@/_data';
import type { SignUpData } from '@/_entities/auth';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { Logger } from '@/_libs/tools/logger.tools';

import { prisma } from './prisma.client';
import { UserService } from './prisma.user';

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

      const user = await prisma.user.create({
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
}
