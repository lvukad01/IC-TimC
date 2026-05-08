import { EmployeeResponse } from '@lumii/types';

export class EmployeeResponseDto implements EmployeeResponse {
  id: string;
  workingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  timeOff: {
    id: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }[];
  name: string;
  role: string;
  isActive: boolean;
}
