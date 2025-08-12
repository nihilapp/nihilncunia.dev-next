import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { JwtHelper } from '@/_libs/tools/jwt.tools';
import { Logger } from '@/_libs/tools/logger.tools';

// 로그아웃
export async function POST() {
  try {
    // 쿠키에서 액세스 토큰 가져오기
    const accessToken = await CookieHelper.get<string>('access_token');

    if (accessToken) {
      // 토큰에서 사용자 ID 추출
      const tokenValidation = await JwtHelper.verifyWithUser(accessToken, 'access');

      if (tokenValidation.isValid && tokenValidation.user) {
        // AuthService를 통한 로그아웃 처리
        await authService.signOut(tokenValidation.user.id);
      }
    }

    // 쿠키 제거
    await CookieHelper.remove('access_token');
    await CookieHelper.remove('refresh_token');

    return successResponse({
      data: true,
      message: '로그아웃되었습니다.',
      status: 200,
    });
  }
  catch (error) {
    Logger.error('SIGNOUT_ERROR', error);

    return errorResponse({
      message: '로그아웃 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
