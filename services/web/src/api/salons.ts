import { api } from './index';

export const getSalons = async () => {
  return api.get('/salons');
};

export const getNearbySalons = async () => {
  return api.get('/salons/nearby');
};
