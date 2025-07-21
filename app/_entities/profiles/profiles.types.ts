import type { profilesTable, ProfileRole as ProfileRoleEnum } from './profiles.table';

// 타입 정의
export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
export type ProfileRole = (typeof ProfileRoleEnum.enumValues)[number];

// 통합된 프로필 업데이트 타입
export interface UpdateProfile {
  email?: string;
  password?: string;
  newPassword?: string;
  username?: string;
  role?: ProfileRole;
  bio?: string;
  image?: string;
}

// 기존 타입들 (하위 호환성을 위해 유지)
export interface UpdateProfileEmail {
  email: string;
  newEmail: string;
}

export interface UpdateProfilePassword {
  password: string;
  newPassword: string;
}

export interface UpdateProfileUsername {
  username: string;
  newUsername: string;
}

export interface UpdateProfileRole {
  newRole: ProfileRole;
}

export interface UpdateProfileBio {
  bio: string;
}

export interface UpdateProfileImage {
  image: string;
}
