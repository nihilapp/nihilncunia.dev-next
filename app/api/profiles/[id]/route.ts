import type { NextRequest } from 'next/server';

import { messageData } from '@/_data';
import type { UpdateProfile } from '@/_entities/profiles/profiles.types';
import { createErrorResponse, createResponse } from '@/api/_libs/responseHelper';
import { serverClient } from '@/api/_libs/supabase';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// 프로필 정보를 가져옴
export async function GET(req: NextRequest, { params, }: Params) {
  const { id, } = await params;
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

    const { data, error, } = await client
      .from('profiles')
      .select('*')
      .eq('profile_id', id)
      .single();

    if (error) {
      return createErrorResponse({
        message: messageData.profile.getError,
        status: 500,
      });
    }

    if (!data) {
      return createErrorResponse({
        message: messageData.profile.notFound,
        status: 404,
      });
    }

    return createResponse({
      message: messageData.profile.getSuccess,
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

// 프로필 정보를 업데이트함
export async function PATCH(req: NextRequest, { params, }: Params) {
  const { id, } = await params;
  const updateData: UpdateProfile = await req.json();
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

    // 프로필 존재 여부 확인
    const { data: existingProfile, error: fetchError, } = await client
      .from('profiles')
      .select('*')
      .eq('profile_id', id)
      .single();

    if (fetchError || !existingProfile) {
      return createErrorResponse({
        message: messageData.profile.notFound,
        status: 404,
      });
    }

    // 권한 확인: 본인 또는 관리자만 수정 가능
    const isOwner = session.user.id === id;

    // 현재 사용자의 프로필 정보 조회
    const { data: currentUserProfile, error: currentUserError, } = await client
      .from('profiles')
      .select('role')
      .eq('profile_id', session.user.id)
      .single();

    const isAdmin = !currentUserError && currentUserProfile
      && (currentUserProfile.role === 'ADMIN' || currentUserProfile.role === 'SUPER_ADMIN');

    if (!isOwner && !isAdmin) {
      return createErrorResponse({
        message: messageData.common.forbidden,
        status: 403,
      });
    }

    // 업데이트할 데이터 필터링
    const filteredUpdateData: any = {};

    if (updateData.email) {
      filteredUpdateData.email = updateData.email;
    }

    if (updateData.username) {
      filteredUpdateData.username = updateData.username;
    }

    if (updateData.image) {
      filteredUpdateData.image = updateData.image;
    }

    if (updateData.bio) {
      filteredUpdateData.bio = updateData.bio;
    }

    // 역할 변경은 관리자만 가능
    if (updateData.role && isAdmin) {
      filteredUpdateData.role = updateData.role;
    }

    // 비밀번호 변경 처리 (본인만 가능)
    if (updateData.password && updateData.newPassword && isOwner) {
      // 기존 비밀번호 확인
      const { data: authData, error: authError, } = await client.auth.signInWithPassword({
        email: existingProfile.email,
        password: updateData.password,
      });

      if (authError || authData.user.id !== id) {
        return createErrorResponse({
          message: messageData.profile.invalidPassword,
          status: 401,
        });
      }

      // 새 비밀번호로 업데이트
      const { error: passwordError, } = await client.auth.updateUser({
        password: updateData.newPassword,
      });

      if (passwordError) {
        return createErrorResponse({
          message: messageData.profile.passwordChangeError,
          status: 500,
        });
      }
    }

    // 프로필 데이터 업데이트
    const { data, error, } = await client
      .from('profiles')
      .update(filteredUpdateData)
      .eq('profile_id', id)
      .select()
      .single();

    if (error) {
      return createErrorResponse({
        message: messageData.profile.updateError,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.profile.updateSuccess,
      result: data,
      status: 200,
    }, headers);
  }
  catch (error) {
    console.error('프로필 업데이트 오류:', error);

    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params, }: Params) {
  const { id, } = await params;
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

    // 프로필 존재 여부 확인
    const { data: existingProfile, error: fetchError, } = await client
      .from('profiles')
      .select('*')
      .eq('profile_id', id)
      .single();

    if (fetchError || !existingProfile) {
      return createErrorResponse({
        message: messageData.profile.notFound,
        status: 404,
      });
    }

    // 권한 확인: 본인 또는 관리자만 삭제 가능
    const isOwner = session.user.id === id;

    // 현재 사용자의 프로필 정보 조회
    const { data: currentUserProfile, error: currentUserError, } = await client
      .from('profiles')
      .select('role')
      .eq('profile_id', session.user.id)
      .single();

    const isAdmin = !currentUserError && currentUserProfile
      && (currentUserProfile.role === 'ADMIN' || currentUserProfile.role === 'SUPER_ADMIN');

    if (!isOwner && !isAdmin) {
      return createErrorResponse({
        message: messageData.common.forbidden,
        status: 403,
      });
    }

    // 프로필 삭제
    const { error, } = await client
      .from('profiles')
      .delete()
      .eq('profile_id', id);

    if (error) {
      return createErrorResponse({
        message: messageData.profile.deleteError,
        status: 500,
      });
    }

    return createResponse({
      message: messageData.profile.deleteSuccess,
      result: null,
      status: 200,
    }, headers);
  }
  catch (error) {
    console.error('프로필 삭제 오류:', error);

    return createErrorResponse({
      message: messageData.common.error,
      status: 500,
    });
  }
}
