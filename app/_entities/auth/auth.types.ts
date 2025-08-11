import type { UserWithOmitPassword } from '@/_entities/users';
import type { UserRole } from '@/_prisma';

export interface SignUpData {
  email: string;
  username: string;
  role: UserRole;
  password: string;
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
