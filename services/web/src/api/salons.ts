import { api } from './index';

export const getSalons = async () => {
  return api.get('/salons');
};
