import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

// 프로필 목록을 가져옴
export async function GET(req: NextRequest) {
  const { client, headers, } = serverClient(req);

  try {
    // 세션 검증
    const { data: { session, }, error: sessionError, } = await client.auth.getSession();

    if (sessionError || !session) {
      return createErrorResponse({
        message: messageData.common.unauthorized,
        status: 401,
      });
    }

    const { searchParams, } = new URL(req.url);

    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    let query = client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false, });

    if (pageParam && limitParam) {
      const page = parseInt(pageParam, 10);
      const limit = parseInt(limitParam, 10);
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, } = await query;

    if (error) {
      return createErrorResponse({
        message: messageData.profile.listError,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.profile.listSuccess,
      result: data,
      status: 200,
    }, headers);
  }
  catch (error) {
    console.error('프로필 목록 조회 오류:', error);

    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}

// 다중 프로필 삭제 (관리자용)
export async function DELETE(req: NextRequest) {
  const { client, headers, } = serverClient(req);

  try {
    // 세션 검증
    const { data: { session, }, error: sessionError, } = await client.auth.getSession();

    if (sessionError || !session) {
      return createErrorResponse({
        message: messageData.common.unauthorized,
        status: 401,
      });
    }

    // 관리자 권한 확인
    const { data: userProfile, error: profileError, } = await client
      .from('profiles')
      .select('role')
      .eq('profile_id', session.user.id)
      .single();

    if (profileError || !userProfile || (userProfile.role !== 'ADMIN' && userProfile.role !== 'SUPER_ADMIN')) {
      return createErrorResponse({
        message: messageData.common.forbidden,
        status: 403,
      });
    }

    const ids: string[] = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return createErrorResponse({
        message: messageData.common.invalidRequest,
        status: 400,
      });
    }

    // 삭제할 프로필들이 존재하는지 확인
    const { data: existingProfiles, error: fetchError, } = await client
      .from('profiles')
      .select('profile_id')
      .in('profile_id', ids);

    if (fetchError) {
      return createErrorResponse({
        message: messageData.profile.getError,
        status: 500,
      });
    }

    if (!existingProfiles || existingProfiles.length === 0) {
      return createErrorResponse({
        message: messageData.profile.notFound,
        status: 404,
      });
    }

    // 다중 삭제 실행
    const { error, } = await client
      .from('profiles')
      .delete()
      .in('profile_id', ids);

    if (error) {
      return createErrorResponse({
        message: messageData.profile.deleteMultipleError,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.profile.deleteMultipleSuccess,
      result: null,
      status: 200,
    }, headers);
  }
  catch (error) {
    console.error('다중 프로필 삭제 오류:', error);

    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}
