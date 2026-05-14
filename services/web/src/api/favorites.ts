import { api } from './index';

export const addFavorite = async (salonId: string) => {
  return api.post(`/favorites/${salonId}`);
};

export const removeFavorite = async (salonId: string) => {
  return api.delete(`/favorites/${salonId}`);
};

export const getFavorites = async () => {
  return api.get('/favorites');
};
