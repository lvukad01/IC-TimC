import { BookingResponseDto } from '@bookings/dto/booking-response.dto';
import { Bookings } from '@prisma/client';

export function toBookingResponse(booking: Bookings): BookingResponseDto {
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
  };
}
