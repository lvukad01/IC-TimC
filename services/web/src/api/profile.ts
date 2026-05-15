import type { UpdateUserRequest, UserResponse } from '@lumii/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '.';
import { QueryKeys } from './queryKeys';

export const updateProfile = (data: UpdateUserRequest): Promise<UserResponse> => {
  return api.put<UserResponse>('/users/me', data);
};

export const getProfile = (): Promise<UserResponse> => {
  return api.get<UserResponse>('/users/me');
};

export const useProfile = () => {
  return useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: getProfile,
  });
};
