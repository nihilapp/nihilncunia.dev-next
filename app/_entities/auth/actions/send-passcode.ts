'use server';

import { genCode } from './gen-code';

export interface SendPasscodeActionData {
  success: boolean;
  message: string;
  data?: { step: number };
}

export async function sendPasscodeAction(): Promise<SendPasscodeActionData> {
  try {
    // 패스코드 생성
    const passcode = await genCode();

    // TODO: 생성된 패스코드를 사용자에게 전송하는 로직 구현
    // 예: 이메일, SMS, 푸시 알림 등
    console.log('생성된 패스코드:', passcode);

    // TODO: 패스코드를 임시 저장 (세션, 쿠키, DB 등)
    // 예: await CookieHelper.set('temp_passcode', passcode, 300); // 5분

    return {
      success: true,
      message: '인증 코드가 전송되었습니다.',
      data: { step: 2, },
    };
  }
  catch (error) {
    console.error('패스코드 전송 에러:', error);

    return {
      success: false,
      message: '인증 코드 전송에 실패했습니다. 다시 시도해주세요.',
    };
  }
}
