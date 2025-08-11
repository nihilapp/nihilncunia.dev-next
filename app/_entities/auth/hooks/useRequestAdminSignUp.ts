import { useMutation } from '@tanstack/react-query';

import type { MutationOptionType } from '@/_entities/common';

import type { AdminSignUpFormData } from '../admin-sighup.form-model';
import { requestAdminSignUp } from '../auth.api';

interface UseRequestAdminSignUpOptions extends MutationOptionType<{ message: string }, AdminSignUpFormData> {}

export function useRequestAdminSignUp(options: UseRequestAdminSignUpOptions = {}) {
  return useMutation({
    mutationFn: async (data: AdminSignUpFormData) => {
      const response = await requestAdminSignUp(data);
      return response.data;
    },
    ...options,
  });
}
