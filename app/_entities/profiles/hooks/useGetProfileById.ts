import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useLoading, useDone } from '@/_entities/common';
import type { ApiError } from '@/_entities/common/common.types';
import { getProfileById } from '@/_entities/profiles/profiles.api';
import type { Profile } from '@/_entities/profiles/profiles.types';

interface UseGetProfileByIdOptions extends Omit<UseQueryOptions<Profile, AxiosError<ApiError>, Profile, ['profile', string]>, 'queryKey' | 'queryFn'> {
  id: string;
}

export function useGetProfileById(options: UseGetProfileByIdOptions) {
  const { id, ...other } = options;

  const { data: profile, isLoading, isFetching, isSuccess, ...otherQuery } = useQuery<Profile, AxiosError<ApiError>>({
    queryKey: [
      'profile',
      id,
    ],
    queryFn: () => getProfileById(id),
    enabled: !!id,
    ...other,
  });

  const loading = useLoading(isLoading, isFetching);
  const done = useDone(loading, isSuccess);

  return {
    profile,
    loading,
    done,
    ...otherQuery,
  };
}
