import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

export async function POST(req: NextRequest) {
  const { client, headers, } = serverClient(req);

  try {
    // � ��� � Ux
    const { data: userData, error: userError, } = await client.auth.getUser();

    if (userError || !userData.user) {
      return createErrorResponse({
        message: messageData.auth.sessionExpired,
        status: 401,
      });
    }

    // profiles Lt� ��� Ux
    const { data: profileData, error: profileError, } = await client
      .from('profiles')
      .select('*')
      .eq('profile_id', userData.user.id)
      .single();

    if (profileError || !profileData) {
      return createErrorResponse({
        message: messageData.auth.notFound,
        status: 404,
      });
    }

    // Supabase Auth\ \�D� ��
    const { error: signOutError, } = await client.auth.signOut();

    if (signOutError) {
      return createErrorResponse({
        message: signOutError.message,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.auth.signOutSuccess,
      status: 200,
    }, headers);
  }
  catch {
    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}
