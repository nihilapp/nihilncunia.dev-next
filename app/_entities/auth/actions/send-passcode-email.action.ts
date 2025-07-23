'use server';

import { DateTime } from 'luxon';
import nodemailer from 'nodemailer';

import { type ActionError, type ActionResult } from '@/_entities/auth';
import { generatePasscode } from '@/_entities/auth/actions/generate-passcode.action';
import {
  CookieHelper,
  createActionError,
  createActionSuccess
} from '@/_libs/tools';

interface FormState {
  success: boolean;
  step?: number;
  error?: ActionError;
}

/**
 * 폼 액션 함수 - useActionState에서 사용
 */
export async function sendPasscodeFormAction(): Promise<FormState> {
  const result = await sendPasscodeEmail();

  if (result.success) {
    return { success: true, step: result.data.step, };
  }

  return { success: false, error: (result as { success: false; error: ActionError }).error, };
}

/**
 * 네이버 SMTP를 이용해 패스코드 메일을 발송합니다.
 */
export async function sendPasscodeEmail(): Promise<
  ActionResult<{ step: number }>
> {
  try {
    const passcode = await generatePasscode();
    if (!passcode) {
      return createActionError(
        'PASSCODE_GENERATION_FAILED',
        '패스코드 생성에 실패했습니다.'
      );
    }

    const expires = DateTime.now().plus({ minutes: 5, }).toISO();
    if (!expires) {
      return createActionError(
        'EXPIRES_GENERATION_FAILED',
        '만료 시간 생성에 실패했습니다.'
      );
    }

    try {
      await CookieHelper.set('passcode', passcode, 300);
      await CookieHelper.set('passcode_expires', expires, 300);
    }
    catch (cookieError) {
      console.error('[sendPasscodeEmail] 쿠키 저장 실패:', cookieError);
      return createActionError(
        'COOKIE_SET_FAILED',
        '인증 정보 저장에 실패했습니다.'
      );
    }

    if (
      !process.env.MAIL_FROM
      || !process.env.MAIL_FROM_PASSWORD
      || !process.env.MAIL_TO
    ) {
      console.error('[sendPasscodeEmail] 필수 환경변수 누락');
      return createActionError(
        'MISSING_ENV_VARS',
        '메일 설정이 올바르지 않습니다.'
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_FROM_PASSWORD,
      },
    });

    try {
      await transporter.verify();
    }
    catch (verifyError) {
      console.error('[sendPasscodeEmail] SMTP 연결 실패:', verifyError);
      return createActionError(
        'SMTP_CONNECTION_FAILED',
        '메일 서버에 연결할 수 없습니다.'
      );
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: '[nihilncunia.dev] 패스코드 인증 요청',
      text: `패스코드: ${passcode}\n5분 이내에 입력하세요.`,
    };

    await transporter.sendMail(mailOptions);

    console.log('[sendPasscodeEmail] 패스코드 메일 발송 성공');
    return createActionSuccess({ step: 2, });
  }
  catch (error) {
    if (error instanceof Error) {
      console.error('[sendPasscodeEmail] 메일 발송 실패:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    else {
      console.error('[sendPasscodeEmail] 알 수 없는 에러:', error);
    }

    return createActionError(
      'UNKNOWN_ERROR',
      '알 수 없는 오류로 메일 발송에 실패했습니다.'
    );
  }
}
