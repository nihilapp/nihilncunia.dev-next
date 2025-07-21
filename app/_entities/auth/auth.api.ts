import type { SignInData, SignOutData, SignUpData, UserSession, SignUpResponse, SignOutResponse } from '@/_entities/auth/auth.types';
import { Api } from '@/_libs';

export async function signUp(data: SignUpData) {
  return Api.postQuery<SignUpResponse, SignUpData>('/auth/signup', data);
}

export async function signIn(data: SignInData) {
  return Api.postQuery<UserSession, SignInData>('/auth/signin', data);
}

export async function signOut(data: SignOutData) {
  return Api.postQuery<SignOutResponse, SignOutData>('/auth/signout', data);
}

// 세션 정보 조회 (user + profile)
export async function getSession() {
  return Api.getQuery<UserSession>('/auth/session');
}
