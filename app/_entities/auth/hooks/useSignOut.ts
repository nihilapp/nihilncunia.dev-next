import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { signOut } from '@/_entities/auth/auth.api';
import type { SignOutData, SignOutResponse } from '@/_entities/auth/auth.types';
import type { ApiError } from '@/_entities/common/common.types';

interface UseSignOutOptions extends Omit<UseMutationOptions<SignOutResponse, AxiosError<ApiError>, SignOutData>, 'mutationFn'> {}

export function useSignOut(options: UseSignOutOptions = {}) {
  return useMutation<SignOutResponse, AxiosError<ApiError>, SignOutData>({
    mutationFn: (data: SignOutData) => signOut(data),
    ...options,
  });
}
