import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { signIn } from '@/_entities/auth/auth.api';
import type { SignInData, UserSession } from '@/_entities/auth/auth.types';
import type { ApiError } from '@/_entities/common/common.types';

interface UseSignInOptions extends Omit<UseMutationOptions<UserSession, AxiosError<ApiError>, SignInData>, 'mutationFn'> {}

export function useSignIn(options: UseSignInOptions = {}) {
  return useMutation<UserSession, AxiosError<ApiError>, SignInData>({
    mutationFn: (data: SignInData) => signIn(data),
    ...options,
  });
}
