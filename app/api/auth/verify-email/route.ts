import type { NextRequest } from 'next/server';

import type { ForgotPasswordData } from '@/_entities/auth';
import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

// 비밀번호 재설정 이메일 발송 (임시 비밀번호 포함)
export async function POST(request: NextRequest) {
  try {
    const { email, }: ForgotPasswordData = await request.json();

    if (!email) {
      return errorResponse({
        message: '이메일을 입력해주세요.',
        status: 400,
      });
    }

    const result = await authService.resetPasswordAndSendEmail(email);

    if (!result.data) {
      return errorResponse({
        message: result.message,
        status: 400,
      });
    }

    return successResponse({
      data: true,
      message: result.message,
      status: 200,
    });
  }
  catch (error) {
    Logger.error('VERIFY_EMAIL_API_ERROR', error);

    return errorResponse({
      message: '임시 비밀번호 발송 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
