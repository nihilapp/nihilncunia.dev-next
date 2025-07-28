'use server';

import nodemailer from 'nodemailer';

import { genCode } from '@/(auth)/auth/guard/_actions/gen-code';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';

type SendCodeResult = {
  step: number;
  message: string;
};

/**
 * 패스코드를 이메일로 전송하고 쿠키에 저장합니다.
 *
 * 패스코드는 5분간 유효하며, 쿠키에 저장되어 나중에 검증할 수 있습니다.
 *
 * @returns 전송 성공 여부
 */
export async function sendCode(): Promise<SendCodeResult> {
  try {
    const passCode = await genCode();
    Logger.auth('패스코드 생성 완료');

    await CookieHelper.set('auth_passcode', passCode, '5m');
    Logger.auth('패스코드 쿠키 저장 완료');

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_FROM_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: '[인증] 패스코드가 발송되었습니다',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">인증 패스코드</h2>
        <p>다음 패스코드를 입력하여 인증을 완료해주세요:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin: 0; font-family: monospace; font-size: 18px;">${passCode}</h3>
        </div>
        <p style="color: #666; font-size: 14px;">이 패스코드는 5분간 유효합니다.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    Logger.auth('이메일 발송 완료');

    return {
      step: 2,
      message: '패스코드가 발송되었습니다.',
    };
  }
  catch (error) {
    Logger.authError('패스코드 전송 실패', { error, });

    return {
      step: 1,
      message: '패스코드 전송 실패',
    };
  }
}
