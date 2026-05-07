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
