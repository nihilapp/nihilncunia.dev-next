'use server';

import { redirect } from 'next/navigation';

export interface VerifyPasscodeActionData {
  success: boolean;
  message: string;
}

export interface VerifyPasscodeFormData {
  passCode: string;
}

export async function verifyPasscodeAction(formData: FormData): Promise<VerifyPasscodeActionData> {
  try {
    const passCode = formData.get('passCode') as string;

    // 입력값 검증
    if (!passCode || !passCode.trim()) {
      return {
        success: false,
        message: '인증 코드를 입력해주세요.',
      };
    }

    // TODO: 저장된 패스코드와 비교하는 로직 구현
    // 예: const savedPasscode = await CookieHelper.get('temp_passcode');
    // if (passCode !== savedPasscode) { ... }
    console.log('검증할 패스코드:', passCode);

    // TODO: 실제 패스코드 검증 로직
    // 임시로 항상 성공으로 처리
    const isValid = true; // 실제로는 저장된 패스코드와 비교

    if (!isValid) {
      return {
        success: false,
        message: '인증 코드가 올바르지 않습니다.',
      };
    }

    // TODO: 검증 성공 후 처리 (세션 생성, 쿠키 정리 등)
    // 예: await CookieHelper.remove('temp_passcode');

    // 인증 완료 후 complete 페이지로 리다이렉트
    redirect('/auth/guard/complete');
  }
  catch (error) {
    console.error('패스코드 검증 에러:', error);

    return {
      success: false,
      message: '인증 코드 검증에 실패했습니다. 다시 시도해주세요.',
    };
  }
}
