import { authMessage, userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { UserService } from '@/_entities/users/users.service';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

import type { SignInData, AuthResult } from '../auth.types';

/**
 * 사용자 로그인
 * @param signInData 사용자 로그인 정보
 * @returns 사용자 및 토큰
 */
export async function signIn(signInData: SignInData): PrismaReturn<AuthResult | null> {
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
