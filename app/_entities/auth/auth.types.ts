import type { User } from '@supabase/supabase-js';

import type { ApiResponse } from '@/_entities/common';
import type { Profile } from '@/_entities/profiles/profiles.types';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignOutData {
  // 로그아웃은 추가 데이터가 필요 없음
}

// 실제 데이터 구조
export interface UserSessionData {
  user: User;
  profile: Profile;
}

// API 응답 타입들
export interface UserSession extends ApiResponse<UserSessionData> {}

export interface SignUpResponse {
  message: string;
}

export interface SignOutResponse {
  message: string;
}
