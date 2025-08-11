import type { UserRole } from '@/_prisma';

export interface SignUpData {
  email: string;
  username: string;
  role: UserRole;
  password: string;
}
