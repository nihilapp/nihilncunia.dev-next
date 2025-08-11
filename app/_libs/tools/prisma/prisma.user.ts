import { userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import { Logger } from '@/_libs/tools/logger.tools';
import type { User } from '@/_prisma';

import { prisma } from './prisma.client';

export class UserService {
  /**
   * 사용자 아이디로 사용자 가져오기
   * @param userId 사용자 아이디
   * @returns 사용자
   */
  static async getUserById(userId: string): PrismaReturn<Omit<User, 'password_hash' | 'refresh_token'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
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
        data: user,
        message: userMessage.getDetailSuccess,
      };
    }
    catch (error) {
      Logger.error('USER_GET_BY_ID_ERROR', error);

      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  /**
   * 이메일로 사용자 가져오기
   * @param email 이메일
   * @returns 사용자
   */
  static async getUserByEmail(email: string): PrismaReturn<Omit<User, 'password_hash' | 'refresh_token'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        omit: {
          password_hash: true,
          refresh_token: true,
        },
      });

      if (!user) {
        return {
          data: null,
          message: userMessage.emailNotFound,
        };
      }

      return {
        data: user,
        message: userMessage.getDetailSuccess,
      };
    }
    catch (error) {
      Logger.error('USER_GET_BY_EMAIL_ERROR', error);

      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }
}
