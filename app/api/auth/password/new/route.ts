import type { NextRequest } from 'next/server';

import { authMessage, userMessage } from '@/_data';
import type { ChangePasswordData } from '@/_entities/auth';
import { userService } from '@/_entities/users/users.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { Logger } from '@/_libs/tools/logger.tools';

export async function POST(request: NextRequest) {
  // 미들웨어에서 추가한 사용자 ID 가져오기
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return errorResponse({
      message: authMessage.unauthorized,
      status: 401,
    });
  }

  try {
    const { currentPassword, newPassword, confirmPassword, }: ChangePasswordData
      = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorResponse({
        message: '모든 필드를 입력해주세요.',
        status: 400,
      });
    }

    if (newPassword !== confirmPassword) {
      return errorResponse({
        message: userMessage.passwordMismatch,
        status: 400,
      });
    }

    const result = await userService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

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
    Logger.error('CHANGE_PASSWORD_API_ERROR', error);
    return errorResponse({
      message: authMessage.newPasswordError,
      status: 500,
    });
  }
}
