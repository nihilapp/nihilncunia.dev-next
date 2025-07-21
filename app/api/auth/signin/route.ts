import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import type { SignInData } from '@/_entities/auth';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

export async function POST(req: NextRequest) {
  const { client, headers, } = serverClient(req);
  const signInData: SignInData = await req.json();

  const { email, password, } = signInData;

  try {
    // 먼저 profiles 테이블에서 이메일 확인
    const { data: profileData, error: profileError, } = await client
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      return createErrorResponse({
        message: messageData.auth.invalidCredentials,
        status: 401,
      });
    }

    // Supabase Auth로 로그인 처리
    const { data: authData, error: authError, } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return createErrorResponse({
        message: messageData.auth.invalidCredentials,
        status: 401,
      });
    }

    // 로그인 성공 시 로그 출력
    console.log('[로그인 성공] user:', authData.user);
    console.log('[로그인 성공] profile:', profileData);
    console.log('[로그인 성공] result:', {
      user: authData.user,
      profile: profileData,
    });

    return createResponse({
      result: {
        user: authData.user,
        profile: profileData,
      },
      message: messageData.auth.signInSuccess,
      status: 200,
    }, headers);
  }
  catch {
    return createErrorResponse({
      message: messageData.auth.signInError,
      status: 500,
    });
  }
}
