import nodemailer from 'nodemailer';

import { getServerConfig } from '@/_libs/tools/config.loader';

// Nodemailer 트랜스포터 인스턴스를 캐싱하여 재사용
let transporter: nodemailer.Transporter | null = null;

async function getNodemailerTransporter() {
  if (!transporter) {
    const config = await getServerConfig();
    const mailConfig = config.server.nodemailer;

    if (!mailConfig.provider.auth.user || !mailConfig.provider.auth.pass) {
      throw new Error('Nodemailer 인증 정보가 설정되지 않았습니다.');
    }

    transporter = nodemailer.createTransport({
      host: mailConfig.provider.name,
      port: mailConfig.provider.port,
      secure: mailConfig.provider.secure === 'true',
      requireTLS: mailConfig.provider.requireTLS === 'true',
      auth: {
        user: mailConfig.provider.auth.user,
        pass: mailConfig.provider.auth.pass,
      },
    });
  }
  return transporter;
}

export class EmailHelper {
  /**
   * 관리자 인증을 위한 6자리 코드를 이메일로 발송합니다.
   * @param code - 발송할 6자리 인증 코드
   */
  static async sendVerificationCode(code: string): Promise<void> {
    const mailTransporter = await getNodemailerTransporter();
    const config = await getServerConfig();
    const fromAddress = config.server.nodemailer.provider.auth.user;
    const toAddress = config.server.nodemailer.provider.to;

    if (!fromAddress) {
      throw new Error('이메일 발신자 주소가 설정되지 않았습니다.');
    }

    if (!toAddress) {
      throw new Error('이메일 수신자 주소가 설정되지 않았습니다.');
    }

    // 개발 환경에서는 콘솔에 인증 코드 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [개발환경] 관리자 인증 코드:', code);
      console.log('📧 [개발환경] 수신자 이메일:', toAddress);
      console.log('📤 [개발환경] 발신자 이메일:', fromAddress);
      console.log('⚙️ [개발환경] 설정 확인:', {
        from: fromAddress,
        to: toAddress,
        host: config.server.nodemailer.provider.name,
        port: config.server.nodemailer.provider.port,
        secure: config.server.nodemailer.provider.secure,
        requireTLS: config.server.nodemailer.provider.requireTLS,
      });
    }

    try {
      const mailOptions = {
        from: `"NIHILNCUNIA.DEV" <${fromAddress}>`,
        to: toAddress, // 설정 파일의 to 필드 사용
        subject: '인증코드',
        html: `
          <div style="font-family: monospace; font-size: 24px; text-align: center; padding: 40px;">
            인증코드: ${code}
          </div>
          <div style="font-size: 12px; text-align: center; color: #666;">
            본인이 요청한 것이 아니라면 무시하십시오.
          </div>
        `,
      };

      const result = await mailTransporter.sendMail(mailOptions);

      // 메일 발송 성공 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [개발환경] 메일 발송 성공:', result);
      }
    }
    catch (error) {
      console.error('❌ [개발환경] 메일 발송 실패:', error);
      throw new Error('인증 코드 이메일 발송에 실패했습니다.');
    }
  }
}
