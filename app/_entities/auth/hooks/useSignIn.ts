import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn } from '@/_entities/auth/auth.api';
import type { SignInData } from '@/_entities/auth/auth.types';
import type { MutationOptionType } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { userKeys } from '@/_entities/users/users.keys';

interface UseSignInOptions extends Omit<MutationOptionType<UserWithOmitPassword, SignInData>, 'onSuccess'> {
  onSuccess?: (data: UserWithOmitPassword, variables: SignInData, context: unknown) => void;
}

export function useSignIn(options: UseSignInOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signInData: SignInData) => {
      const response = await signIn(signInData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // 기본 로직: 로그인 성공 시 사용자 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: userKeys.all(),
      });

      // 추가 로직이 있다면 실행
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}
