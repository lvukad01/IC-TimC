export interface CreateEmployeeRequest {
  name: string;
  role: string;
  isActive: boolean;
}

export interface CreateEmployeesRequest {
  employees: CreateEmployeeRequest[];
}

export interface UpdateEmployeeRequest {
  name?: string;
  role?: string;
  isActive?: boolean;
}

export interface AddWorkingHoursRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AddTimeOffRequest {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
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
}
