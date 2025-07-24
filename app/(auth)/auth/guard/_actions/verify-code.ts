'use server';

import { CookieHelper } from '@/_libs/tools/cookie.tools';

type VerifyCodeResult = {
  step: number;
  message: string;
};

/**
 * 사용자가 입력한 패스코드를 쿠키에 저장된 패스코드와 비교하여 검증합니다.
 *
 * 검증 성공 시 쿠키에서 패스코드를 삭제하여 재사용을 방지합니다.
 *
 * @param inputCode - 사용자가 입력한 패스코드
 * @returns 검증 성공 여부
 */
export async function verifyCode(passCode: string): Promise<VerifyCodeResult> {
  try {
    // 쿠키에서 저장된 패스코드 가져오기
    const storedCode = await CookieHelper.get<string>('auth_passcode');

    // 저장된 패스코드가 없으면 실패
    if (!storedCode) {
      return {
        step: 1,
        message: '패스코드가 없습니다.',
      };
    }

    // 패스코드 비교 (대소문자 구분)
    const isValid = passCode === storedCode;

    // 검증 성공 시 쿠키에서 패스코드 삭제
    if (isValid) {
      await CookieHelper.remove('auth_passcode');
    }

    return {
      step: isValid
        ? 3
        : 2,
      message: isValid
        ? '패스코드가 일치합니다.'
        : '패스코드가 일치하지 않습니다.',
    };
  }
  catch (error) {
    console.error('패스코드 검증 실패:', error);

    return {
      step: 1,
      message: '패스코드 검증 실패',
    };
  }
}
