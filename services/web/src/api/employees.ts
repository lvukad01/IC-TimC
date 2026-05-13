import type { ActionResponse, CreateEmployeesRequest } from '@lumii/types';
import { api } from '.';

export const addEmployees = (
  salonId: string,
  data: CreateEmployeesRequest,
): Promise<ActionResponse> => {
  return api.post<ActionResponse>(`/salons/${salonId}/employees/batch`, data);
};
