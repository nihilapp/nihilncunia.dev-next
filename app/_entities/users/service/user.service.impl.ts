import { userMessage } from '@/_data';
import type { SignUpData, AdminSignUpData, ChangePasswordData } from '@/_entities/auth/auth.types';
import type { PrismaReturn } from '@/_entities/common';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import type { User } from '@/_prisma';

import type { UserDaoType } from '../dao/user.dao.interface';
import type { UserWithOmitPassword, UserWithPassword } from '../users.types';

import type { UserServiceType } from './user.service.interface';

export class UserService implements UserServiceType {
  constructor(private userDao: UserDaoType) {}

  async getUserById(id: string): PrismaReturn<UserWithOmitPassword | null> {
    try {
      const user = await this.userDao.findUserById(id);

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
      Logger.error('GET_USER_BY_ID_ERROR', error);
      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  async getUserByEmail(email: string): PrismaReturn<User | null> {
    try {
      const user = await this.userDao.findUserByEmail(email);

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
      Logger.error('GET_USER_BY_EMAIL_ERROR', error);
      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  async getUserByEmailWithPassword(email: string): PrismaReturn<UserWithPassword | null> {
    try {
      const user = await this.userDao.findUserByEmailWithPassword(email);

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
      Logger.error('GET_USER_BY_EMAIL_WITH_PASSWORD_ERROR', error);
      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  async getUserByIdWithPassword(id: string): PrismaReturn<UserWithPassword | null> {
    try {
      const user = await this.userDao.findUserByIdWithPassword(id);

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
      Logger.error('GET_USER_BY_ID_WITH_PASSWORD_ERROR', error);
      return {
        data: null,
        message: userMessage.getDetailError,
      };
    }
  }

  // 사용자 생성 관련 메서드들

  async createUser(signUpData: SignUpData): PrismaReturn<UserWithOmitPassword | null> {
    try {
      const findUser = await this.userDao.findUserByEmail(signUpData.email);

      if (findUser) {
        return {
          data: null,
          message: userMessage.emailAlreadyExists,
        };
      }

      const user = await this.userDao.createUser(signUpData);

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

  async createAdminUser(signUpData: AdminSignUpData): PrismaReturn<UserWithOmitPassword | null> {
    try {
      const findUser = await this.userDao.findUserByEmail(signUpData.email);

      if (findUser) {
        return {
          data: null,
          message: userMessage.emailAlreadyExists,
        };
      }

      const user = await this.userDao.createAdminUser(signUpData);

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

  // 사용자 정보 업데이트 관련 메서드들

  async changePassword(
    userId: string,
    changePasswordData: Omit<ChangePasswordData, 'confirmPassword'>
  ): PrismaReturn<boolean> {
    try {
      const { currentPassword, newPassword, } = changePasswordData;
      const user = await this.userDao.findUserByIdWithPassword(userId);

      if (!user) {
        return {
          data: false,
          message: userMessage.userNotFound,
        };
      }

      const isPasswordValid = await BcryptHelper.dataCompare(
        user.password_hash,
        currentPassword
      );

      if (!isPasswordValid) {
        return {
          data: false,
          message: userMessage.currentPasswordIncorrect,
        };
      }

      const newPasswordHash = await BcryptHelper.dataToHash(newPassword);
      await this.userDao.updatePassword(userId, newPasswordHash);

      Logger.userAction('PASSWORD_CHANGED', userId);

      return {
        data: true,
        message: userMessage.updateSuccess,
      };
    }
    catch (error) {
      Logger.error('CHANGE_PASSWORD_ERROR', error);
      return {
        data: false,
        message: userMessage.updateError,
      };
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): PrismaReturn<void> {
    try {
      await this.userDao.updateRefreshToken(userId, refreshToken);

      return {
        data: undefined,
        message: userMessage.updateSuccess,
      };
    }
    catch (error) {
      Logger.error('UPDATE_REFRESH_TOKEN_ERROR', error);
      return {
        data: undefined,
        message: userMessage.updateError,
      };
    }
  }

  async updatePassword(userId: string, hashedPassword: string): PrismaReturn<void> {
    try {
      await this.userDao.updatePassword(userId, hashedPassword);

      return {
        data: undefined,
        message: userMessage.updateSuccess,
      };
    }
    catch (error) {
      Logger.error('UPDATE_PASSWORD_ERROR', error);
      return {
        data: undefined,
        message: userMessage.updateError,
      };
    }
  }
}
