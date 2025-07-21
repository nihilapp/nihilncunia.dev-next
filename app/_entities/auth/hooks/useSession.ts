import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getSession } from '@/_entities/auth/auth.api';
import type { UserSession } from '@/_entities/auth/auth.types';
import type { ApiError } from '@/_entities/common/common.types';

export function useSession(options?: UseQueryOptions<UserSession, AxiosError<ApiError>, UserSession, ['auth', 'session']>) {
  return useQuery<UserSession, AxiosError<ApiError>, UserSession, ['auth', 'session']>({
    queryKey: [
      'auth',
      'session',
    ],
    queryFn: getSession,
    ...(options || {}),
  });
}
