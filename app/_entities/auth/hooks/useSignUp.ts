import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signUp } from '@/_entities/auth/auth.api';
import type { SignUpData } from '@/_entities/auth/auth.types';
import type { MutationOptionType } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';
import { userKeys } from '@/_entities/users/users.keys';

interface UseSignUpOptions extends Omit<MutationOptionType<UserWithOmitPassword, SignUpData>, 'onSuccess'> {
  onSuccess?: (data: UserWithOmitPassword, variables: SignUpData, context: unknown) => void;
}

export function useSignUp(options: UseSignUpOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signUpData: SignUpData) => {
      const response = await signUp(signUpData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // 기본 로직: 회원가입 성공 시 사용자 관련 쿼리 무효화
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
