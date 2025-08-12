import { authMessage, userMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import { UserService } from '@/_entities/users/users.service';
import { BcryptHelper } from '@/_libs/tools/bcrypt.tools';
import { CommonHelper } from '@/_libs/tools/common.tools';
import { EmailHelper } from '@/_libs/tools/email.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { PrismaHelper } from '@/_libs/tools/prisma.tools';

/**
 * 임시 비밀번호 생성 및 업데이트
 * @param email 사용자 이메일
 * @returns 임시 비밀번호
 */
export async function updateTempPassword(email: string): PrismaReturn<string> {
  try {
    const findUser = await UserService.getUserByEmailWithPassword(email);

    if (!findUser.data) {
      return {
        data: null,
        message: userMessage.emailNotFound,
      };
    }

    // 8자리 임시 비밀번호 생성 (영대소문자, 숫자, 특수문자 각각 하나씩 포함)
    const tempPassword = CommonHelper.generateTemporaryPassword();

    // 임시 비밀번호 해시
    const tempPasswordHash = await BcryptHelper.dataToHash(tempPassword);

    // 비밀번호 업데이트
    await PrismaHelper.client.user.update({
      where: { id: findUser.data.id, },
      data: { password_hash: tempPasswordHash, },
    });

    Logger.userAction('PASSWORD_RESET', findUser.data.id, { email: findUser.data.email, });

    return {
      data: tempPassword,
      message: authMessage.forgotPasswordSuccess,
    };
  }
  catch (error) {
    Logger.error('PASSWORD_RESET_ERROR', error);

    return {
      data: null,
      message: authMessage.forgotPasswordError,
    };
  }
}

/**
 * 임시 비밀번호 생성, 업데이트 및 이메일 발송
 * @param email 사용자 이메일
 * @returns 성공 여부
 */
export async function resetPasswordAndSendEmail(email: string): PrismaReturn<boolean> {
  try {
    const findUser = await UserService.getUserByEmailWithPassword(email);

    if (!findUser.data) {
      return {
        data: false,
        message: userMessage.emailNotFound,
      };
    }

    // 임시 비밀번호 생성 및 업데이트
    const tempPasswordResult = await updateTempPassword(email);

    if (!tempPasswordResult.data) {
      return {
        data: false,
        message: tempPasswordResult.message,
      };
    }

    // 임시 비밀번호를 이메일로 발송
    await EmailHelper.sendTemporaryPassword(email, tempPasswordResult.data);

    Logger.userAction('PASSWORD_RESET_EMAIL_SENT', findUser.data.id, { email: findUser.data.email, });

    return {
      data: true,
      message: authMessage.forgotPasswordEmailSent,
    };
  }
  catch (error) {
    Logger.error('PASSWORD_RESET_EMAIL_ERROR', error);

    return {
      data: false,
      message: authMessage.forgotPasswordError,
    };
  }
}

/**
 * 임시 비밀번호로 새 비밀번호 설정
 * @param email 사용자 이메일
 * @param tempPassword 임시 비밀번호
 * @param newPassword 새 비밀번호
 * @returns 성공 여부
 */
export async function resetPasswordWithTemp(
  email: string,
  tempPassword: string,
  newPassword: string
): PrismaReturn<boolean> {
  try {
    const findUser = await UserService.getUserByEmailWithPassword(email);

    if (!findUser.data) {
      return {
        data: false,
        message: userMessage.emailNotFound,
      };
    }

    // 임시 비밀번호 검증
    const isValidTempPassword = await BcryptHelper.dataCompare(tempPassword, findUser.data.password_hash);

    if (!isValidTempPassword) {
      return {
        data: false,
        message: '임시 비밀번호가 일치하지 않습니다.',
      };
    }

    // 새 비밀번호 해시
    const newPasswordHash = await BcryptHelper.dataToHash(newPassword);

    // 비밀번호 업데이트
    await PrismaHelper.client.user.update({
      where: { id: findUser.data.id, },
      data: { password_hash: newPasswordHash, },
    });

    Logger.userAction('PASSWORD_RESET_COMPLETED', findUser.data.id, { email: findUser.data.email, });

    return {
      data: true,
      message: authMessage.resetPasswordSuccess,
    };
  }
  catch (error) {
    Logger.error('PASSWORD_RESET_WITH_TEMP_ERROR', error);

    return {
      data: false,
      message: authMessage.resetPasswordError,
    };
  }
}
