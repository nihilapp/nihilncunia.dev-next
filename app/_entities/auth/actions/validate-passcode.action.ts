'use server';

import { type ActionError, type ActionResult } from '@/_entities/auth';
import {
  CookieHelper,
  createActionError,
  createActionSuccess,
  DateTools
} from '@/_libs/tools';

interface FormState {
  success: boolean;
  error?: ActionError;
}

/**
 * 폼 액션 함수 - useActionState에서 사용
 */
export async function validatePasscodeFormAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const passcode = formData.get('passcode') as string;

  if (!passcode) {
    return {
      success: false,
      error: {
        code: 'FORM_VALIDATION_ERROR',
        message: '패스코드를 입력해주세요.',
      },
    };
  }

  if (passcode.length !== 60) {
    return {
      success: false,
      error: {
        code: 'FORM_VALIDATION_ERROR',
        message: '60자리 패스코드를 입력해주세요.',
      },
    };
  }

  const result = await validatePasscode(passcode);

  if (!result.success) {
    return { success: false, error: (result as { success: false; error: ActionError }).error, };
  }

  return { success: true, };
}

/**
 * 입력된 패스코드를 쿠키에서 읽어 검증합니다.
 * - 쿠키에 저장된 패스코드와 만료시각을 가져와 비교
 * - 5분 이내, 값이 일치하면 24시간 인증 쿠키 발급
 * - 검증 후 패스코드 관련 쿠키는 삭제
 * @param input 사용자가 입력한 패스코드
 * @returns 성공 여부(boolean)
 */
export async function validatePasscode(
  input: string
): Promise<ActionResult<true>> {
  const passcode = await CookieHelper.get<string>('passcode');
  const expires = await CookieHelper.get<string>('passcode_expires');

  if (!passcode || !expires) {
    return createActionError(
      'NO_PASSCODE_COOKIE',
      '패스코드 정보가 없습니다. 다시 시도해주세요.'
    );
  }

  const now = DateTools.now();
  if (DateTools.isAfter(now, expires)) {
    await CookieHelper.remove('passcode');
    await CookieHelper.remove('passcode_expires');
    return createActionError('PASSCODE_EXPIRED', '패스코드가 만료되었습니다.');
  }

  if (input !== passcode) {
    return createActionError(
      'PASSCODE_INCORRECT',
      '패스코드가 올바르지 않습니다.'
    );
  }

  await CookieHelper.set('admin_passcode_verified', 'true', 60 * 60 * 24); // 24시간

  await CookieHelper.remove('passcode');
  await CookieHelper.remove('passcode_expires');

  return createActionSuccess(true);
}
