import { authMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

/**
 * 사용자 로그아웃
 * @param userId 사용자 ID
 * @returns 성공 여부
 */
export async function signOut(userId: string): PrismaReturn<boolean> {
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
