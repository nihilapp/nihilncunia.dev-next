import { useMutation } from '@tanstack/react-query';

import { sendResetPasswordEmail } from '@/_entities/auth/auth.api';
import type { ForgotPasswordData } from '@/_entities/auth/auth.types';
import type { MutationOptionType } from '@/_entities/common';

interface UseSendResetPasswordEmailOptions extends Omit<MutationOptionType<{ data: boolean;
  message: string; }, ForgotPasswordData>, 'onSuccess'> {
  onSuccess?: (data: { data: boolean;
    message: string; }, variables: ForgotPasswordData, context: unknown) => void;
}

export function useSendResetPasswordEmail(options: UseSendResetPasswordEmailOptions = {}) {
  return useMutation({
    mutationFn: async (forgotPasswordData: ForgotPasswordData) => {
      const response = await sendResetPasswordEmail(forgotPasswordData);
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
