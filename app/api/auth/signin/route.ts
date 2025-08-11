import type { NextRequest } from 'next/server';

import type { SignInData } from '@/_entities/auth';
import { AuthService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';
import { getServerConfig } from '@/_libs/tools/config.loader';
import { CookieHelper } from '@/_libs/tools/cookie.tools';

// 사용자 로그인
export async function POST(request: NextRequest) {
  try {
    const signInData: SignInData = await request.json();

    const signInResult = await AuthService.signIn(signInData);

    if (!signInResult.data) {
      return errorResponse({
        message: signInResult.message,
        status: 400,
      });
    }

    // JWT 설정 가져오기
    const app = await getServerConfig();
    const { access_token_exp, refresh_token_exp, } = app.server.jwt;

    // JWT 토큰을 쿠키에 설정
    await CookieHelper.set(
      'access_token',
      signInResult.data.accessToken,
      access_token_exp
    );
    await CookieHelper.set(
      'refresh_token',
      signInResult.data.refreshToken,
      refresh_token_exp
    );

    return successResponse({
      data: signInResult.data.user,
      status: 200,
    });
  }
  catch (error) {
    Logger.error('USER_SIGNIN_API_ERROR', error);

    return errorResponse({
      message: '로그인 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
