import type { UserWithOmitPassword } from '@/_entities/users';
import { Api } from '@/_libs/tools/axios.tools';

import type { SignUpData } from './auth.types';

/**
 * 사용자 회원가입
 * @param signUpData 사용자 회원가입 데이터
 * @returns 사용자 회원가입 결과
 */
export async function signUp(signUpData: SignUpData) {
  return Api.postQuery<UserWithOmitPassword, SignUpData>('/api/auth/signup', signUpData);
}
