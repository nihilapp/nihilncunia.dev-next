import { useMutation } from '@tanstack/react-query';

import type { MutationOptionType } from '@/_entities/common';
import type { UserWithOmitPassword } from '@/_entities/users';

import type { AdminSignUpFormData } from '../admin-sighup.form-model';
import { completeAdminSignUp } from '../auth.api';

interface UseCompleteAdminSignUpOptions extends MutationOptionType<UserWithOmitPassword, AdminSignUpFormData & { verificationCode: string }> {}

export function useCompleteAdminSignUp(options: UseCompleteAdminSignUpOptions = {}) {
  return useMutation({
    mutationFn: async (data: AdminSignUpFormData & { verificationCode: string }) => {
      const response = await completeAdminSignUp(data);
      return response.data;
    },
    ...options,
  });
}
