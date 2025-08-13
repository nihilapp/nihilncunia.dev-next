import type { NextRequest } from 'next/server';

import { authMessage } from '@/_data';
import type { ForgotPasswordData } from '@/_entities/auth';
import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

// 비밀번호 재설정 이메일 발송 (토큰 기반)
export async function POST(request: NextRequest) {
  try {
    const { email, }: ForgotPasswordData = await request.json();

    if (!email) {
      return errorResponse({
        message: '이메일을 입력해주세요.',
        status: 400,
      });
    }

    const result = await authService.requestPasswordReset(email);

    // 이메일 존재 여부와 관계없이 항상 성공으로 응답하여 보안 강화
    return successResponse({
      data: true,
      message: result.message,
      status: 200,
    });
  }
  catch (error) {
    Logger.error('FORGOT_PASSWORD_API_ERROR', error);

    // 내부 서버 오류가 발생하더라도 사용자에게는 일관된 메시지 반환
    return successResponse({
      data: true,
      message: authMessage.resetPasswordLinkSent,
      status: 200,
    });
  }
}
