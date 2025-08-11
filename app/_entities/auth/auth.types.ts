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
