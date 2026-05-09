import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AvailabilityRequestDto } from './dto/availability-request.dto';
import { ErrorMessages } from '@lumii/messages';
import { VALIDATION_MESSAGES } from '@lumii/messages';
import { BookingStatus } from '@lumii/types';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBookings(userId: string) {
    return this.prisma.bookings.findMany({
      where: { clientId: userId },
    });
  }
  async findBookingById(bookingId: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
    });
    if (!booking)
      throw new NotFoundException(ErrorMessages.notFound('Booking'));
    return booking;
  }

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const service = await this.prisma.services.findUnique({
      where: { id: createBookingDto.serviceId },
    });

    if (!service)
      throw new NotFoundException(ErrorMessages.notFound('Service'));
    const employee = await this.prisma.employees.findUnique({
      where: { id: createBookingDto.employeeId },
    });

    if (!employee)
      throw new NotFoundException(ErrorMessages.notFound('Employee'));

    const startTime = new Date(createBookingDto.startTime);
    const endTime = new Date(createBookingDto.endTime);
    if (startTime >= endTime) {
      throw new NotFoundException(
        VALIDATION_MESSAGES.INVALID_START_TIME_END_TIME,
      );
    }

    const dayOfWeek = startTime.getDay();
    const workingHours = await this.prisma.workingHours.findFirst({
      where: {
        employeeId: createBookingDto.employeeId,
        dayOfWeek: dayOfWeek,
      },
    });
    if (!workingHours) {
      throw new BadRequestException(VALIDATION_MESSAGES.EMPLOYEE_NOT_AVAILABLE);
    }
    const workStart = new Date(startTime);
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date(startTime);
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number);
    workEnd.setHours(endHour, endMin, 0, 0);

    if (startTime < workStart || endTime > workEnd) {
      throw new BadRequestException(VALIDATION_MESSAGES.INVALID_WORKING_HOURS);
    }

    return this.prisma.bookings.create({
      data: {
        clientId: userId,
        serviceId: createBookingDto.serviceId,
        employeeId: employee.id,
        startTime: createBookingDto.startTime,
        endTime: createBookingDto.endTime,
        salonId: service.salonId,
      },
    });
  }

  async deleteBooking(bookingId: string) {
    const booking = await this.findBookingById(bookingId);
    return this.prisma.bookings.delete({
      where: { id: booking.id },
    });
  }

  async findBookingsForSalon(salonId: string, employeeId?: string) {
    return this.prisma.bookings.findMany({
      where: {
        salonId: salonId,
        ...(employeeId && { employeeId }),
      },
    });
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    await this.findBookingById(bookingId);
    return this.prisma.bookings.update({
      where: { id: bookingId },
      data: { status: status },
    });
  }
  async findAvailability(
    employeeId: string,
    availabilityRequestDto: AvailabilityRequestDto,
  ) {}
}
