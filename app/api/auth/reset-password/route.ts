import type { NextRequest } from 'next/server';

import type { ResetPasswordData } from '@/_entities/auth';
import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

// 임시 비밀번호로 새 비밀번호 설정
export async function POST(request: NextRequest) {
  try {
    const { email, tempPassword, newPassword, confirmPassword, }: ResetPasswordData = await request.json();

    // 필수 필드 검증
    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      return errorResponse({
        message: '모든 필드를 입력해주세요.',
        status: 400,
      });
    }

    // 새 비밀번호 확인 검증
    if (newPassword !== confirmPassword) {
      return errorResponse({
        message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
        status: 400,
      });
    }

    // 비밀번호 복잡성 검증
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      return errorResponse({
        message: '새 비밀번호는 8자 이상이며, 영대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
        status: 400,
      });
    }

    const result = await authService.resetPasswordWithTemp(email, tempPassword, newPassword);

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
      message: '비밀번호 재설정 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
