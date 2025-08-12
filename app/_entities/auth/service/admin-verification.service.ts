import { authMessage } from '@/_data';
import type { PrismaReturn } from '@/_entities/common';
import { EmailHelper } from '@/_libs/tools/email.tools';
import { Logger } from '@/_libs/tools/logger.tools';

/**
 * 관리자 인증 코드 생성 및 발송
 * @returns 성공 여부
 */
export async function createAdminVerification(): PrismaReturn<boolean> {
  try {
    const code = Math.random().toString().substring(2, 8);

    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === 'development') {
      Logger.info('ADMIN_VERIFICATION', '인증 코드 생성 시작', {
        code,
      });
    }

    // 설정 파일의 to 필드로 이메일 발송
    await EmailHelper.sendVerificationCode(code);

    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === 'development') {
      Logger.info('ADMIN_VERIFICATION', '인증 코드 이메일 발송 완료');
    }

    return {
      data: true,
      message: authMessage.adminVerificationCodeSent,
    };
  }
  catch (error) {
    Logger.error('ADMIN_VERIFICATION', '인증 코드 생성 실패', error);
    return {
      data: false,
      message: authMessage.adminVerificationCodeError,
    };
  }
}

/**
 * 관리자 인증 코드 검증
 * @param code - 사용자가 입력한 코드
 * @returns 성공 여부
 */
export async function verifyAdminCode(code: string): PrismaReturn<boolean> {
  try {
    // 개발 환경에서는 콘솔에 인증 코드 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [개발환경] 인증 코드 검증 요청:', code);
    }

    // 현재는 단순히 코드가 6자리 숫자인지만 확인
    if (!/^\d{6}$/.test(code)) {
      return {
        data: false,
        message: '인증 코드는 6자리 숫자여야 합니다.',
      };
    }

    return {
      data: true,
      message: authMessage.adminVerificationSuccess,
    };
  }
  catch (error) {
    Logger.error('ADMIN_VERIFICATION_VERIFY_ERROR', error);
    return {
      data: false,
      message: authMessage.adminVerificationError,
    };
  }
}
