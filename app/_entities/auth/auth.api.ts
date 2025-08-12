import type { UserWithOmitPassword } from '@/_entities/users';
import { Api } from '@/_libs/tools/axios.tools';

import type { AdminSignUpFormData } from './admin-sighup.form-model';
import type { SignUpData, SignInData, AdminSignUpData, ForgotPasswordData, ResetPasswordData } from './auth.types';

/**
 * 사용자 회원가입
 * @param signUpData 사용자 회원가입 데이터
 * @returns 사용자 회원가입 결과
 */
export async function signUp(signUpData: SignUpData) {
  return Api.postQuery<UserWithOmitPassword, SignUpData>('/auth/signup', signUpData);
}

/**
 * 사용자 로그인
 * @param signInData 사용자 로그인 데이터
 * @returns 사용자 로그인 결과
 */
export async function signIn(signInData: SignInData) {
  return Api.postQuery<UserWithOmitPassword, SignInData>('/auth/signin', signInData);
}

/**
 * 세션 검증
 * @returns 현재 사용자 정보
 */
export async function verifySession() {
  return Api.getQuery<UserWithOmitPassword>('/auth/session');
}

/**
 * 로그아웃
 * @returns 로그아웃 결과
 */
export async function signOut() {
  return Api.postQuery<{ data: boolean;
    message: string; }, Record<string, never>>('/auth/signout', {});
}

/**
 * 관리자 회원가입 요청
 * @param data 관리자 회원가입 데이터
 * @returns 관리자 회원가입 결과
 */
export async function requestAdminSignUp(data: AdminSignUpFormData) {
  return Api.postQuery<{ data: boolean;
    message: string; }, AdminSignUpFormData>('/auth/admin/signup', data);
}

/**
 * 관리자 회원가입 완료
 * @param data 관리자 회원가입 데이터
 * @returns 관리자 회원가입 결과
 */
export async function completeAdminSignUp(data: AdminSignUpFormData & { verificationCode: string }) {
  return Api.postQuery<UserWithOmitPassword, AdminSignUpData & { verificationCode: string }>('/auth/admin/signup', data);
}

/**
 * 비밀번호 재설정 이메일 발송
 * @param data 비밀번호 재설정 이메일 데이터
 * @returns 비밀번호 재설정 이메일 발송 결과
 */
export async function sendResetPasswordEmail(data: ForgotPasswordData) {
  return Api.postQuery<{ data: boolean;
    message: string; }, ForgotPasswordData>('/auth/verify-email', data);
}

/**
 * 비밀번호 재설정
 * @param data 비밀번호 재설정 데이터
 * @returns 비밀번호 재설정 결과
 */
export async function resetPassword(data: ResetPasswordData) {
  return Api.postQuery<{ data: boolean;
    message: string; }, ResetPasswordData>('/auth/reset-password', data);
}
