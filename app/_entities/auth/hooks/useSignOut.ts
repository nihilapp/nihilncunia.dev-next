import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signOut } from '@/_entities/auth/auth.api';
import { useAuthStore } from '@/_entities/auth/auth.store';
import type { MutationOptionType } from '@/_entities/common';

interface UseSignOutOptions extends MutationOptionType<{ message: string }, void> {}

export function useSignOut(options: UseSignOutOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout, } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await signOut();
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // 로컬 상태 정리
      logout();

      // 모든 쿼리 무효화
      queryClient.clear();

      // 홈으로 리다이렉트
      router.push('/');

      // 추가 로직이 있다면 실행
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}
