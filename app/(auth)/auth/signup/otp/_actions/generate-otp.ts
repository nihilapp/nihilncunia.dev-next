'use server';

import { authenticator } from 'otplib';
import QRCode from 'qrcode';

import { Logger } from '@/_libs/tools/logger.tools';

export async function generateOtp(email: string) {
  const secret = authenticator.generateSecret();
  const serviceName = 'nihilncunia.dev';
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);

  const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

  Logger.auth('OTP 시크릿 및 QR 코드 생성 완료', { email, });

  return {
    qrCodeUrl,
    secret,
  };
}
