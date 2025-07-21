import type { Profile, UpdateProfile } from '@/_entities/profiles/profiles.types';
import { Api } from '@/_libs';

interface PaginationParams {
  page?: number;
  limit?: number;
}

export async function getProfiles(params?: PaginationParams) {
  const query = params
    ? `?page=${params.page || 1}&limit=${params.limit || 10}`
    : '';
  return Api.getQuery<Profile[]>(`/profiles${query}`);
}

export async function getProfileById(id: string) {
  return Api.getQuery<Profile>(`/profiles/${id}`);
}

export async function getProfileByEmail(email: string, params?: PaginationParams) {
  const query = params
    ? `?page=${params.page || 1}&limit=${params.limit || 10}`
    : '';
  return Api.getQuery<Profile[]>(`/profiles/email/${email}${query}`);
}

// 통합된 프로필 업데이트 함수
export async function updateProfile(id: string, data: UpdateProfile) {
  return Api.patchQuery<Profile, UpdateProfile>(`/profiles/${id}`, data);
}

export async function deleteProfile(id: string) {
  return Api.deleteQuery<void>(`/profiles/${id}`);
}

// 다중 프로필 삭제 (관리자용)
export async function deleteProfiles(ids: string[]) {
  return Api.deletesQuery<void, string[]>('/profiles', ids);
}
