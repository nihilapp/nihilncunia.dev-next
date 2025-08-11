import type { NextRequest } from 'next/server';

import { AuthService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';
import { CookieHelper } from '@/_libs/tools/cookie.tools';

// 세션 검증
export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 토큰 가져오기
    const accessToken = await CookieHelper.get<string>('access_token');
    const refreshToken = await CookieHelper.get<string>('refresh_token');

    if (!accessToken || !refreshToken) {
      return errorResponse({
        message: '인증 토큰이 없습니다.',
        status: 401,
      });
    }

    // AuthService를 통한 세션 검증
    const sessionResult = await AuthService.verifySession(accessToken, refreshToken);

    if (!sessionResult.data) {
      // 세션이 유효하지 않은 경우 쿠키 제거
      await CookieHelper.remove('access_token');
      await CookieHelper.remove('refresh_token');

      return errorResponse({
        message: sessionResult.message,
        status: 401,
      });
    }

    // 새로운 토큰이 발급된 경우 쿠키 업데이트
    if (sessionResult.data.accessToken && sessionResult.data.refreshToken) {
      const app = await import('@/_libs/tools/config.loader').then((m) => m.getServerConfig());
      const { access_token_exp, refresh_token_exp, } = app.server.jwt;

      await CookieHelper.set('access_token', sessionResult.data.accessToken, access_token_exp);
      await CookieHelper.set('refresh_token', sessionResult.data.refreshToken, refresh_token_exp);
    }

    return successResponse({
      data: sessionResult.data.user,
      status: 200,
    });
  }
  catch (error) {
    Logger.error('SESSION_VERIFICATION_ERROR', error);

    return errorResponse({
      message: '세션 검증 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
