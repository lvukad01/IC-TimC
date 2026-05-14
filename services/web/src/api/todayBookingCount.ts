import { api } from './index';

export const getTodayBookingsCount = async () => {
  return api.get('/booking-stats/today-count');
};
