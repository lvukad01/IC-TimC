import { BookingStatus } from '../enums/enum';

export interface CreateBookingRequest {
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface BookingResponse {
  id: string;
  clientId: string;
  salonId: string;
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface AvailabilityRequest {
  date: string;
  serviceId: string;
}

export interface AvailabilityResponse {
  startTime: string;
  endTime: string;
}
