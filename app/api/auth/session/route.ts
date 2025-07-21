import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

export async function GET(req: NextRequest) {
  const { client, headers, } = serverClient(req);
  try {
    // 현재 유저 정보
    const { data: userData, error: userError, } = await client.auth.getUser();
    if (userError || !userData.user) {
      return createErrorResponse({
        message: messageData.auth.sessionExpired || '세션이 만료되었습니다.',
        status: 401,
      });
    }
    // 프로필 정보
    const { data: profileData, error: profileError, } = await client
      .from('profiles')
      .select('*')
      .eq('email', userData.user.email)
      .single();
    if (profileError || !profileData) {
      return createErrorResponse({
        message: messageData.auth.notFound || '프로필을 찾을 수 없습니다.',
        status: 404,
      });
    }
    return createResponse({
      result: {
        user: userData.user,
        profile: profileData,
      },
      message: '세션 정보 조회 성공',
      status: 200,
    }, headers);
  }
  catch (err) {
    return createErrorResponse({
      message: '세션 정보 조회 중 오류가 발생했습니다.',
      status: 500,
    });
  }
}
