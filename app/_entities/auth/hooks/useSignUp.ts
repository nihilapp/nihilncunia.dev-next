import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { signUp } from '@/_entities/auth/auth.api';
import type { SignUpData, SignUpResponse } from '@/_entities/auth/auth.types';
import type { ApiError } from '@/_entities/common/common.types';

interface UseSignUpOptions extends Omit<UseMutationOptions<SignUpResponse, AxiosError<ApiError>, SignUpData>, 'mutationFn'> {}

export function useSignUp(options: UseSignUpOptions = {}) {
  return useMutation<SignUpResponse, AxiosError<ApiError>, SignUpData>({
    mutationFn: (data: SignUpData) => signUp(data),
    ...options,
  });
}
