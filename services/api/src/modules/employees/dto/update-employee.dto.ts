import { EmployeeRole, UpdateEmployeeRequest } from '@lumii/types';

export class UpdateEmployeeDto implements UpdateEmployeeRequest {
  name?: string;
  role?: EmployeeRole;
  isActive?: boolean;
}
