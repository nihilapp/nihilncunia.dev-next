import type { NextRequest } from 'next/server';

import { authMessage } from '@/_data';
import { authService } from '@/_entities/auth/auth.service';
import type { TokenResetPasswordData } from '@/_entities/auth/auth.types';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

// 토큰을 사용하여 새 비밀번호 설정
export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword, confirmPassword, }: TokenResetPasswordData & { email: string } = await request.json();

    if (!email || !token || !newPassword || !confirmPassword) {
      return errorResponse({
        message: '모든 필드를 입력해주세요.',
        status: 400,
      });
    }

    if (newPassword !== confirmPassword) {
      return errorResponse({
        message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
        status: 400,
      });
    }

    // 비밀번호 복잡성 검증 (Zod 스키마로 이전하는 것을 권장)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      return errorResponse({
        message: '새 비밀번호는 8자 이상이며, 영대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
        status: 400,
      });
    }

    const result = await authService.resetPassword(token, newPassword);

    if (!result.data) {
      return errorResponse({
        message: result.message,
        status: 400,
      });
    }

    return successResponse({
      data: result.data,
      message: result.message,
      status: 200,
    });
  }
  catch (error) {
    Logger.error('RESET_PASSWORD_API_ERROR', error);

    return errorResponse({
      message: authMessage.resetPasswordError,
      status: 500,
    });
  }
}
