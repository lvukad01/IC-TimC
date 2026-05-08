import { EmployeeResponse } from '@lumii/types';

export class EmployeeResponseDto implements EmployeeResponse {
  id: string;
  working_hours: {
    day_of_week: number;
    start_time: string;
    end_time: string;
  }[];
  time_off: {
    id: string;
    start_date: string;
    end_date: string;
    reason?: string;
  }[];
  name: string;
  role: string;
  is_active: boolean;
}
