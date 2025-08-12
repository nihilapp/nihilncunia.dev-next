import { userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { UserService } from '@/_entities/users/users.service';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

import type { SignUpData, AdminSignUpData } from '../auth.types';

/**
 * 일반 사용자 회원가입
 * @param signUpData 사용자 생성 정보
 * @returns 사용자
 */
export async function signUp(signUpData: SignUpData): PrismaReturn<UserWithOmitPassword | null> {
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
export async function signUpAdmin(signUpData: AdminSignUpData): PrismaReturn<UserWithOmitPassword | null> {
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
