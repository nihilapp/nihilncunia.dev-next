// profiles 자원의 리액트 쿼리 키 정의
export const profileKeys = {
  profiles: [ 'profiles', ] as const,
  all: () => [
    ...profileKeys.profiles,
    'all',
  ] as const,
  byId: (id: string) => [
    ...profileKeys.profiles,
    'byId',
    id,
  ] as const,
  byEmail: (email: string) => [
    ...profileKeys.profiles,
    'byEmail',
    email,
  ] as const,
};
