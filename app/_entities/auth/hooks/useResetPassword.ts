import { useMutation } from '@tanstack/react-query';

import { resetPassword } from '@/_entities/auth/auth.api';
import type { ResetPasswordData } from '@/_entities/auth/auth.types';
import type { MutationOptionType } from '@/_entities/common';

interface UseResetPasswordOptions extends Omit<MutationOptionType<{ data: boolean;
  message: string; }, ResetPasswordData>, 'onSuccess'> {
  onSuccess?: (data: { data: boolean;
    message: string; }, variables: ResetPasswordData, context: unknown) => void;
}

export function useResetPassword(options: UseResetPasswordOptions = {}) {
  return useMutation({
    mutationFn: async (resetPasswordData: ResetPasswordData) => {
      const response = await resetPassword(resetPasswordData);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // 추가 로직이 있다면 실행
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}
