import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ApiError } from '@/_entities/common/common.types';
import { updateProfile } from '@/_entities/profiles/profiles.api';
import type { Profile, UpdateProfile } from '@/_entities/profiles/profiles.types';

interface UpdateProfileParams {
  id: string;
  data: UpdateProfile;
}

interface UseUpdateProfileOptions extends Omit<UseMutationOptions<Profile, AxiosError<ApiError>, UpdateProfileParams>, 'mutationFn'> {}

export function useUpdateProfile(options: UseUpdateProfileOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<Profile, AxiosError<ApiError>, UpdateProfileParams>({
    mutationFn: ({ id, data, }: UpdateProfileParams) => updateProfile(id, data),
    onSuccess: (_, { id, }) => {
      // 프로필 리스트와 상세 정보 모두 invalidate
      queryClient.invalidateQueries({ queryKey: [ 'profiles', ], });
      queryClient.invalidateQueries({
        queryKey: [
          'profile',
          id,
        ],
      });
    },
    ...options,
  });
}
