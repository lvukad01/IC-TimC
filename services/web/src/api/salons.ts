import { api } from './index';

export const getSalons = async () => {
  const response = await api.get('/salons');

  return response.data;
};
