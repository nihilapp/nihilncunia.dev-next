import type { UserWithOmitPassword } from '@/_entities/users';

export interface SignUpData {
  email: string;
  username: string;
  password: string;
}

export interface AdminSignUpData {
  email: string;
  username: string;
  password: string;
  role: 'ADMIN';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserWithOmitPassword;
  accessToken?: string;
  refreshToken?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  tempPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 공통 API 응답 타입들
export interface AuthApiResponse {
  data: boolean;
  message: string;
}
