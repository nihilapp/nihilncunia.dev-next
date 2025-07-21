import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

interface Params {
  params: Promise<{
    email: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params, }: Params
) {
  const { client, headers, } = serverClient(req);
  const { email, } = await params;

  if (!email) {
    return createErrorResponse({
      message: messageData.common.invalidRequest,
      status: 400,
    });
  }

  try {
    // 세션 검증
    const { data: { session, }, error: sessionError, } = await client.auth.getSession();

    if (sessionError || !session) {
      return createErrorResponse({
        message: messageData.common.unauthorized,
        status: 401,
      });
    }

    const { data, error, } = await client
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse({
          message: messageData.profile.notFound,
          status: 404,
        });
      }

      return createErrorResponse({
        message: messageData.profile.getByEmailError,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.profile.getByEmailSuccess,
      result: data,
      status: 200,
    }, headers);
  }
  catch (error) {
    console.error('프로필 조회 오류:', error);

    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}
