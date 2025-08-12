import { authMessage, userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

import type { AuthResult } from '../auth.types';

/**
 * 세션 검증 및 토큰 갱신
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 * @returns 사용자 정보 및 새로운 토큰 (필요시)
 */
export async function verifySession(accessToken: string, refreshToken: string): PrismaReturn<AuthResult | null> {
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
