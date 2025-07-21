import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import type { SignUpData } from '@/_entities/auth';
import { Logger } from '@/_libs';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

export async function POST(req: NextRequest) {
  const { client, headers } = serverClient(req);
  const signUpData: SignUpData = await req.json();

  const { email, username, role, password, } = signUpData;

  Logger.apiRequest('POST', '/api/auth/signup', { email, username, role, });

  try {
    // 먼저 이메일이 겹치지 않는지 확인.
    const { data: emailData, error: emailError, } = await client
      .from('profiles')
      .select('*')
      .eq('email', email);

    if (emailError) {
      Logger.databaseError('프로필 이메일 조회 실패', { email, error: emailError.message, });
      return createErrorResponse({
        message: emailError.message,
        status: 500,
      });
    }

    if (emailData.length > 0) {
      Logger.auth('회원가입 실패: 이메일 중복', { email, });
      return createErrorResponse({
        message: messageData.auth.emailInUse,
        status: 409,
      });
    }

    // 이메일 겹치지 않으면 회원가입 진행.
    const { error, } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
      },
    });

    if (error) {
      Logger.authError('Supabase 회원가입 실패', { email, error: error.message, });
      return createErrorResponse({
        message: error.message,
        status: 500,
      });
    }

    Logger.apiSuccess('POST', '/api/auth/signup', { email, username, });
    return createResponse({
      message: messageData.auth.signUpSuccess,
      status: 201,
    }, headers);
  }
  catch (err) {
    Logger.apiError('POST', '/api/auth/signup', '예상치 못한 오류', { email, error: err, });
    return createErrorResponse({
      message: messageData.auth.signUpError,
      status: 500,
    });
  }
}
