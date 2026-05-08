import { EmployeeResponse } from '@lumii/types';

export class EmployeeResponseDto implements EmployeeResponse {
  name: string;
  role: string;
  is_active: boolean;
}
