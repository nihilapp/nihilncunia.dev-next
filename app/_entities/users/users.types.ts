import type { User } from '@/_prisma';

export type UserWithOmitPassword = Omit<User, 'password_hash' | 'refresh_token'>;
export type UserWithPassword = Omit<User, 'refresh_token'>;
