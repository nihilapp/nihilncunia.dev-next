import type { UserWithOmitPassword } from '@/_entities/users';
import { Api } from '@/_libs/tools/axios.tools';

import type { SignUpData, SignInData } from './auth.types';

/**
 * 사용자 회원가입
 * @param signUpData 사용자 회원가입 데이터
 * @returns 사용자 회원가입 결과
 */
export async function signUp(signUpData: SignUpData) {
  return Api.postQuery<UserWithOmitPassword, SignUpData>('/api/auth/signup', signUpData);
}

/**
 * 사용자 로그인
 * @param signInData 사용자 로그인 데이터
 * @returns 사용자 로그인 결과
 */
export async function signIn(signInData: SignInData) {
  return Api.postQuery<UserWithOmitPassword, SignInData>('/api/auth/signin', signInData);
}

/**
 * 세션 검증
 * @returns 현재 사용자 정보
 */
export async function verifySession() {
  return Api.getQuery<UserWithOmitPassword>('/api/auth/session');
}

/**
 * 로그아웃
 * @returns 로그아웃 결과
 */
export async function signOut() {
  return Api.postQuery<{ message: string }, Record<string, never>>('/api/auth/signout', {});
}
