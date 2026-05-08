export interface CreateEmployeeRequest {
  name: string;
  role: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  role?: string;
  isActive?: boolean;
}

export interface AddWorkingHoursRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface AddTimeOffRequest {
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
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
}
