import { BookingResponseDto } from '@bookings/dto/booking-response.dto';

export function toBookingResponse(booking: any): BookingResponseDto {
  return {
    id: booking.id,
    clientId: booking.clientId,
    salonId: booking.salonId,
    serviceId: booking.serviceId,
    employeeId: booking.employeeId,
    status: booking.status,
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    createdAt: booking.createdAt.toISOString(),

    salon: booking.salon
      ? {
          id: booking.salon.id,
          name: booking.salon.name,
          street: booking.salon.street,
          city: booking.salon.city,
        }
      : undefined,

    service: booking.service
      ? {
          id: booking.service.id,
          name: booking.service.name,
        }
      : undefined,

    employee: booking.employee
      ? {
          id: booking.employee.id,
          name: booking.employee.name,
        }
      : undefined,
  };
}
