import { calculateDepositAmount } from '@helpers/calculate-deposit.helper';
import { validateTimeRange } from '@helpers/time-range.helper';
import { ErrorMessages, VALIDATION_MESSAGES } from '@lumii/messages';
import { BookingStatus } from '@lumii/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from '@payments/payments.service';
import { Employees, WorkingHours } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { SalonsService } from '@salons/salons.service';
import { AvailabilityRequestDto } from './dto/availability-request.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentsService,
    private readonly salonsService: SalonsService,
  ) {}

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

    const employee = await this.getEmployee(createBookingDto.employeeId);

    const startTime = new Date(createBookingDto.startTime);
    const endTime = new Date(createBookingDto.endTime);
    validateTimeRange(startTime, endTime);

    const workingHours = await this.getEmployeeWorkingHours(
      createBookingDto.employeeId,
      startTime,
    );

    this.validateWorkingHours(workingHours, startTime, endTime);
    await this.validateNoOverlap(
      createBookingDto.employeeId,
      startTime,
      endTime,
    );

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.create({
        data: {
          clientId: userId,
          serviceId: createBookingDto.serviceId,
          employeeId: employee.id,
          startTime: createBookingDto.startTime,
          endTime: createBookingDto.endTime,
          salonId: service.salonId,
        },
      });

      const paymentConfig = await this.salonsService.getSalonPaymentConfig(
        service.salonId,
      );

      if (!paymentConfig)
        throw new NotFoundException(ErrorMessages.notFound('Payment config'));

      const totalAmount = service.price.toNumber();

      const depositAmount = calculateDepositAmount({
        totalAmount,
        depositType: paymentConfig.depositType,
        depositValue: paymentConfig.depositValue.toNumber(),
      });
      await this.paymentService.createBookingPayments(
        {
          bookingId: booking.id,
          clientId: userId,
          totalAmount,
          depositAmount,
          method: createBookingDto.method,
        },
        tx,
      );

      return booking;
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

  private async getEmployee(employeeId: string): Promise<Employees> {
    const employee = await this.prisma.employees.findUnique({
      where: { id: employeeId },
    });

    if (!employee)
      throw new NotFoundException(ErrorMessages.notFound('Employee'));

    return employee;
  }

  private validateWorkingHours(
    workingHours: WorkingHours,
    startTime: Date,
    endTime: Date,
  ) {
    const workStart = new Date(startTime);
    const [startHour, startMin] = workingHours.startTime.split(':').map(Number);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date(startTime);
    const [endHour, endMin] = workingHours.endTime.split(':').map(Number);
    workEnd.setHours(endHour, endMin, 0, 0);

    if (startTime < workStart || endTime > workEnd) {
      throw new BadRequestException(VALIDATION_MESSAGES.INVALID_WORKING_HOURS);
    }
  }

  private async getEmployeeWorkingHours(employeeId: string, startTime: Date) {
    const dayOfWeek = startTime.getDay();
    const workingHours = await this.prisma.workingHours.findFirst({
      where: {
        employeeId,
        dayOfWeek: dayOfWeek,
      },
    });

    if (!workingHours) {
      throw new BadRequestException(VALIDATION_MESSAGES.EMPLOYEE_NOT_AVAILABLE);
    }

    return workingHours;
  }

  private async validateNoOverlap(
    employeeId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const conflict = await this.prisma.bookings.findFirst({
      where: {
        employeeId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      throw new BadRequestException(
        VALIDATION_MESSAGES.EMPLOYEE_ALREADY_BOOKED,
      );
    }
  }
}
