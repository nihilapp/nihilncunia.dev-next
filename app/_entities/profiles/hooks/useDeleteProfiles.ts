import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiError } from '@/_entities/common/common.types';
import { deleteProfiles } from '@/_entities/profiles/profiles.api';

interface UseDeleteProfilesOptions extends Omit<UseMutationOptions<void, AxiosError<ApiError>, string[]>, 'mutationFn'> {}

export function useDeleteProfiles(options: UseDeleteProfilesOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string[]>({
    mutationFn: (ids: string[]) => deleteProfiles(ids),
    onSuccess: () => {
      // 프로필 리스트만 invalidate
      queryClient.invalidateQueries({ queryKey: [ 'profiles', ], });
    },
    ...options,
  });
}
