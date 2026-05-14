import { api } from './index';

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
};

export const getServiceCategories = async () => {
  return await api.get<ServiceCategory[]>('/service-categories');
};
