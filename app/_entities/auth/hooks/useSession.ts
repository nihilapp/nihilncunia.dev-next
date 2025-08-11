import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { verifySession } from '@/_entities/auth/auth.api';
import { authKeys } from '@/_entities/auth/auth.keys';
import { useAuthStore } from '@/_entities/auth/auth.store';
import { useDone, useLoading, type QueryOptionType } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';

export function useSession(options?: QueryOptionType<UserWithOmitPassword>) {
  const { user, isAuthenticated, login, logout, setLoading, } = useAuthStore();

  const {
    data: sessionUser,
    isLoading,
    isFetching,
    isSuccess,
    error,
    refetch,
    ...other
  } = useQuery({
    queryKey: authKeys.session(),
    queryFn: verifySession,
    select: (res) => res.data,
    enabled: isAuthenticated, // 인증된 상태에서만 실행
    retry: false, // 실패 시 재시도하지 않음
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    ...options,
  });

  const loading = useLoading(isLoading, isFetching);
  const done = useDone(loading, isSuccess);

  // 세션 상태 동기화
  useEffect(() => {
    setLoading(loading);
  }, [
    loading,
    setLoading,
  ]);

  // 세션 데이터가 있으면 로그인 상태로 설정
  useEffect(() => {
    if (sessionUser && !user) {
      login(sessionUser);
    }
  }, [
    sessionUser,
    user,
    login,
  ]);

  // 에러 발생 시 로그아웃 처리
  useEffect(() => {
    if (error && isAuthenticated) {
      logout();
    }
  }, [
    error,
    isAuthenticated,
    logout,
  ]);

  return {
    sessionUser,
    loading,
    done,
    error,
    refetch,
    isAuthenticated: isAuthenticated && !!sessionUser,
    isLoading: loading,
    ...other,
  };
}
