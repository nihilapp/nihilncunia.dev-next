import type { NextRequest } from 'next/server';

import type { SignUpData } from '@/_entities/auth';
import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

// 사용자 회원가입
export async function POST(request: NextRequest) {
  try {
    const signUpData: SignUpData = await request.json();

    const signUpResult = await authService.signUp(signUpData);

    if (!signUpResult.data) {
      return errorResponse({
        message: signUpResult.message,
        status: 400,
      });
    }

    return successResponse({
      data: signUpResult.data,
      status: 201,
    });
  }
  catch (error) {
    Logger.error('USER_SIGNUP_API_ERROR', error);

    return errorResponse({
      message: '회원가입 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
