import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiError } from '@/_entities/common/common.types';
import { deleteProfile } from '@/_entities/profiles/profiles.api';

interface UseDeleteProfileOptions extends Omit<UseMutationOptions<void, AxiosError<ApiError>, string>, 'mutationFn'> {}

export function useDeleteProfile(options: UseDeleteProfileOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: () => {
      // 프로필 리스트만 invalidate
      queryClient.invalidateQueries({ queryKey: [ 'profiles', ], });
    },
    ...options,
  });
}
