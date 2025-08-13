import type { UserWithOmitPassword } from '@/_entities/users';
import { Api } from '@/_libs/tools/axios.tools';

import type { AdminSignUpFormData } from './admin-sighup.form-model';
import type {
  SignUpData,
  SignInData,
  AdminSignUpData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthApiResponse
} from './auth.types';

/**
 * 사용자 회원가입
 */
export function signUp(signUpData: SignUpData) {
  return Api.postData<UserWithOmitPassword>('/auth/signup', signUpData);
}

/**
 * 사용자 로그인
 */
export function signIn(signInData: SignInData) {
  return Api.postData<UserWithOmitPassword>('/auth/signin', signInData);
}

/**
 * 세션 검증
 */
export function verifySession() {
  return Api.getQuery<UserWithOmitPassword>('/auth/session');
}

/**
 * 로그아웃
 */
export function signOut() {
  return Api.postData<AuthApiResponse>('/auth/signout', {});
}

/**
 * 관리자 회원가입 요청 (1단계: 인증 코드 발송)
 */
export function requestAdminSignUp(data: AdminSignUpFormData) {
  return Api.postData<AuthApiResponse>('/auth/admin/signup', data);
}

/**
 * 관리자 회원가입 완료 (2단계: 인증 코드 검증 + 계정 생성)
 */
export function completeAdminSignUp(data: AdminSignUpFormData & { verificationCode: string }) {
  return Api.postData<UserWithOmitPassword>('/auth/admin/signup', data);
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export function sendResetPasswordEmail(data: ForgotPasswordData) {
  return Api.postData<AuthApiResponse>('/auth/verify-email', data);
}

/**
 * 비밀번호 재설정
 */
export function resetPassword(data: ResetPasswordData) {
  return Api.postData<AuthApiResponse>('/auth/reset-password', data);
}
