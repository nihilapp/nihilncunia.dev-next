import type { NextRequest } from 'next/server';

import { authMessage } from '@/_data';
import type { AdminSignUpData } from '@/_entities/auth';
import { authService } from '@/_entities/auth/auth.service';
import { errorResponse, successResponse } from '@/_libs/responseHelper';
import { getServerConfig } from '@/_libs/tools/config.loader';
import { Logger } from '@/_libs/tools/logger.tools';

export async function POST(request: NextRequest) {
  try {
    const { verificationCode, ...signUpData }: AdminSignUpData & { verificationCode?: string } = await request.json();

    // 1. 개발 환경일 경우, 메일 발송 플래그 확인
    if (process.env.NODE_ENV === 'development') {
      const config = await getServerConfig();
      const enableMailInDev = config.server.mail?.enable_in_development;

      Logger.info('ADMIN_SIGNUP', '개발 환경에서 어드민 회원가입 요청', {
        email: signUpData.email,
        enableMailInDev,
        hasVerificationCode: !!verificationCode,
      });

      // 메일 발송이 활성화되어 있으면 운영 환경과 동일한 로직 실행
      if (enableMailInDev) {
        Logger.info('ADMIN_SIGNUP', '개발 환경에서 메일 발송 활성화됨', { email: signUpData.email, });

        // 인증 코드가 없는 경우: 인증 코드 생성 및 발송 요청
        if (!verificationCode) {
          Logger.info('ADMIN_SIGNUP', '인증 코드 생성 및 발송 요청', { email: signUpData.email, });
          // 개발 환경에서도 설정 파일의 to 필드로 이메일 발송
          const result = await authService.createAdminVerification();
          if (!result.data) {
            return errorResponse({
              message: result.message,
              status: 500,
            });
          }
          return successResponse({
            data: true,
            message: result.message,
            status: 200,
          });
        }

        // 인증 코드가 있는 경우: 코드 검증 및 관리자 계정 생성
        Logger.info('ADMIN_SIGNUP', '인증 코드 검증 및 계정 생성', { email: signUpData.email, });
        const verifyResult = await authService.verifyAdminCode(verificationCode);
        if (!verifyResult.data) {
          return errorResponse({
            message: verifyResult.message,
            status: 400,
          });
        }

        const signUpResult = await authService.signUpAdmin(signUpData);
        if (!signUpResult.data) {
          return errorResponse({
            message: signUpResult.message,
            status: 400,
          });
        }

        return successResponse({
          data: signUpResult.data,
          status: 201,
        });
      }

      // 메일 발송이 비활성화되어 있으면 즉시 관리자 계정 생성
      Logger.info('ADMIN_SIGNUP', '개발 환경에서 메일 발송 비활성화, 즉시 계정 생성', { email: signUpData.email, });
      const result = await authService.signUpAdmin(signUpData);
      if (!result.data) {
        return errorResponse({
          message: result.message,
          status: 400,
        });
      }
      return successResponse({
        data: result.data,
        status: 201,
      });
    }

    // 2. 운영 환경일 경우, 인증 코드 유무에 따라 로직 분기
    Logger.info('ADMIN_SIGNUP', '운영 환경에서 어드민 회원가입 요청', {
      email: signUpData.email,
      hasVerificationCode: !!verificationCode,
    });

    const config = await getServerConfig();
    const superAdminEmail = config.server.admin.super_admin_email;

    if (!superAdminEmail) {
      return errorResponse({
        message: authMessage.adminEmailNotConfigured,
        status: 500,
      });
    }

    // 2-1. 인증 코드가 없는 경우: 인증 코드 생성 및 발송 요청
    if (!verificationCode) {
      Logger.info('ADMIN_SIGNUP', '운영 환경에서 인증 코드 생성 및 발송 요청', { email: signUpData.email, });
      const result = await authService.createAdminVerification();
      if (!result.data) {
        return errorResponse({
          message: result.message,
          status: 500,
        });
      }
      return successResponse({
        data: true,
        message: result.message,
        status: 200,
      });
    }

    // 2-2. 인증 코드가 있는 경우: 코드 검증 및 관리자 계정 생성
    Logger.info('ADMIN_SIGNUP', '운영 환경에서 인증 코드 검증 및 계정 생성', { email: signUpData.email, });
    const verifyResult = await authService.verifyAdminCode(verificationCode);
    if (!verifyResult.data) {
      return errorResponse({
        message: verifyResult.message,
        status: 400,
      });
    }

    const signUpResult = await authService.signUpAdmin(signUpData);
    if (!signUpResult.data) {
      return errorResponse({
        message: signUpResult.message,
        status: 400,
      });
    }

    return successResponse({
      data: signUpResult.data,
      status: 201,
    });
  }
  catch (error) {
    Logger.error('ADMIN_SIGNUP', '어드민 회원가입 API 오류', error);
    return errorResponse({
      message: authMessage.adminSignupError,
      status: 500,
    });
  }
}
