import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useLoading, useDone } from '@/_entities/common';
import type { ApiError } from '@/_entities/common/common.types';
import { getProfiles } from '@/_entities/profiles/profiles.api';
import type { Profile } from '@/_entities/profiles/profiles.types';

interface UseGetProfilesParams {
  page?: number;
  limit?: number;
}

interface UseGetProfilesOptions extends Omit<UseQueryOptions<Profile[], AxiosError<ApiError>, Profile[], ['profiles', UseGetProfilesParams | undefined]>, 'queryKey' | 'queryFn'> {
  params?: UseGetProfilesParams;
}

export function useGetProfiles(options: UseGetProfilesOptions = {}) {
  const { params, ...other } = options;

  const { data: profiles, isLoading, isFetching, isSuccess, ...otherQuery } = useQuery<Profile[], AxiosError<ApiError>>({
    queryKey: [
      'profiles',
      params,
    ],
    queryFn: () => getProfiles(params),
    enabled: true,
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
