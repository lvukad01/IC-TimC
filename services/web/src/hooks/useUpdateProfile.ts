import { updateProfile } from '@api/profile';
import { QueryKeys } from '@api/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface UpdateProfilePayload {
  field: string;
  value: string;
}

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ field, value }: UpdateProfilePayload) => updateProfile({ [field]: value }),
    onMutate: async ({ field, value }) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.PROFILE] });

      const previousProfile = queryClient.getQueryData([QueryKeys.PROFILE]);

      queryClient.setQueryData([QueryKeys.PROFILE], (old: any) => ({
        ...old,
        [field]: value,
      }));

      return { previousProfile };
    },
    onError: (_err, _vars, onMutateResult) => {
      queryClient.setQueryData([QueryKeys.PROFILE], onMutateResult?.previousProfile);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] }),
  });
};

export default useUpdateProfile;
