import type { CreateSalonRequest, SalonDetailResponse } from '@lumii/types';
import { api } from '.';

export const addSalon = (data: CreateSalonRequest): Promise<SalonDetailResponse> => {
  return api.post<SalonDetailResponse>('/salons/', data);
};
