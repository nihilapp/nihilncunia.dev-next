import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useLoading, useDone } from '@/_entities/common';
import type { ApiError } from '@/_entities/common/common.types';
import { getProfileByEmail } from '@/_entities/profiles/profiles.api';
import type { Profile } from '@/_entities/profiles/profiles.types';

interface UseGetProfileByEmailParams {
  page?: number;
  limit?: number;
}

interface UseGetProfileByEmailOptions extends Omit<UseQueryOptions<Profile[], AxiosError<ApiError>, Profile[], ['profiles', 'email', string, UseGetProfileByEmailParams | undefined]>, 'queryKey' | 'queryFn'> {
  email: string;
  params?: UseGetProfileByEmailParams;
}

export function useGetProfileByEmail(options: UseGetProfileByEmailOptions) {
  const { email, params, ...other } = options;

  const { data: profiles, isLoading, isFetching, isSuccess, ...otherQuery } = useQuery<Profile[], AxiosError<ApiError>>({
    queryKey: [
      'profiles',
      'email',
      email,
      params,
    ],
    queryFn: () => getProfileByEmail(email, params),
    enabled: !!email,
    ...other,
  });

  const loading = useLoading(isLoading, isFetching);
  const done = useDone(loading, isSuccess);

  return {
    profiles,
    loading,
    done,
    ...otherQuery,
  };
}
