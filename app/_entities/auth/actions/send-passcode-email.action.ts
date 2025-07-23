'use server';

import { DateTime } from 'luxon';
import nodemailer from 'nodemailer';

import { CookieHelper } from '@/_libs/tools/cookie.tools';

/**
 * 네이버 SMTP를 이용해 패스코드 메일을 발송합니다.
 * - host: smtp.naver.com
 * - port: 465 (SSL)
 * - secure: true
 * - user: 네이버 전체 이메일 주소 (예: yourid@naver.com)
 * - pass: 네이버 비밀번호(앱 비밀번호 권장)
 *
 * 네이버 2단계 인증 사용 시 앱 비밀번호를 발급받아야 SMTP가 정상 동작합니다.
 * user와 from 모두 네이버 전체 이메일 주소여야 하며, 네이버 계정의 실제 메일 주소와 일치해야 합니다.
 *
 * // 예시: 패스코드 발송 시 쿠키에 만료 시각 저장
 * // await CookieHelper.set('passcode_expires', expires, 300); // 5분
 */
export async function sendPasscodeEmail(passcode: string) {
  // 만료시간: 5분 후
  const expires = DateTime.now().plus({ minutes: 5, }).toISO();

  // 패스코드와 만료시각을 쿠키에 5분간 저장
  await CookieHelper.set('passcode', passcode, 300); // 5분
  await CookieHelper.set('passcode_expires', expires, 300); // 5분

  // 네이버 SMTP 설정
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true, // SSL 필요
    auth: {
      user: process.env.MAIL_FROM, // 네이버 이메일 (yourid@naver.com)
      pass: process.env.MAIL_FROM_PASSWORD, // 네이버 비밀번호(앱 비밀번호 권장)
    },
  });

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: '[nihilncunia.dev] 패스코드 인증 요청',
    text: `패스코드: ${passcode}\n5분 이내에 입력하세요.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { step: 1, };
  }
  catch (e) {
    // TODO: 에러 로깅
    return false;
  }
}
