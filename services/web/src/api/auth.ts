import type { AccessToken, LoginRequest, MeResponse, RegisterRequest } from '@lumii/types';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { QueryKeys } from './queryKeys';

export const register = (data: RegisterRequest): Promise<AccessToken> => {
  return api.post<AccessToken>('/auth/register', data);
};

export const login = (data: LoginRequest): Promise<AccessToken> => {
  return api.post<AccessToken>('/auth/login', data);
};

export const me = async (): Promise<MeResponse> => {
  return api.get<MeResponse>('/auth/me');
};

export const useMe = (token: string | null) => {
  return useQuery({
    queryKey: [QueryKeys.ME, token],
    queryFn: me,
    enabled: !!token,
    retry: false,
  });
};
