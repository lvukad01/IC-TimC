import { api } from '@api/index';

export const searchSalons = async (query: string) => {
  return api.get(`/salons?${query}`);
};
