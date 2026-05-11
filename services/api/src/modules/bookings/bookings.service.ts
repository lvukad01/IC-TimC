import { ActionResponseDto } from '@common/common';
import { calculateDepositAmount } from '@helpers/calculate-deposit.helper';
import { calculateRefundPolicy } from '@helpers/refund-policy.helper';
import { validateTimeRange } from '@helpers/time-range.helper';
import { ErrorMessages, VALIDATION_MESSAGES } from '@lumii/messages';
import { BookingStatus, NotificationType, PaymentType } from '@lumii/types';
import { toBookingResponse } from '@mappers/booking-response.mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from '@payments/payments.service';
import { Employees, Payments, WorkingHours } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { SalonsService } from '@salons/salons.service';
import { BookingEmailInfo } from '@tstypes/booking-email-info';
import { BookingAggregate } from '@tstypes/booking-with-payments';
import { Refund } from '@tstypes/payment-input';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { NotificationsService } from '../notifications/notifications.service';
import { AvailabilityRequestDto } from './dto/availability-request.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentsService,
    private readonly salonsService: SalonsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAllBookings(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.bookings.findMany({
      where: { clientId: userId },
    });

    return bookings.map((b) => toBookingResponse(b));
  }

  async findTomorrowBookings(): Promise<BookingEmailInfo[]> {
    const tomorrow = addDays(new Date(), 1);

    const startOfTomorrow = startOfDay(tomorrow);
    const endOfTomorrow = endOfDay(tomorrow);
    return this.prisma.bookings.findMany({
      where: {
        startTime: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        employee: true,
        client: true,
        salon: true,
        service: true,
      },
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

  async createBooking(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const service = await this.prisma.services.findUnique({
      where: { id: createBookingDto.serviceId },
    });

    if (!service)
      throw new NotFoundException(ErrorMessages.notFound('Service'));

    const salon = await this.salonsService.getSalonById(
      service?.salonId,
      userId,
    );

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

    const booking = await this.prisma.$transaction(async (tx) => {
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

    await this.notificationsService.create(userId, {
      content: `Your booking is confirmed for ${service.name} at ${salon.name} on ${startTime.toLocaleString()} with ${employee.name}.`,
      type: NotificationType.CONFIRMATION,
    });

    return toBookingResponse(booking);
  }

  async deleteBooking(bookingId: string): Promise<ActionResponseDto> {
    const booking = await this.findBookingById(bookingId);
    await this.prisma.bookings.delete({
      where: { id: booking.id },
    });

    return { id: bookingId, message: 'Booking successfully deleted' };
  }

  async findBookingsForSalon(
    salonId: string,
    employeeId?: string,
  ): Promise<BookingResponseDto[]> {
    const salonBookings = await this.prisma.bookings.findMany({
      where: {
        salonId: salonId,
        ...(employeeId && { employeeId }),
      },
    });

    return salonBookings.map((b) => toBookingResponse(b));
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<BookingResponseDto> {
    await this.findBookingById(bookingId);

    const updatedBooking = await this.prisma.bookings.update({
      where: { id: bookingId },
      data: { status: status },
    });
    return toBookingResponse(updatedBooking);
  }

  async findAvailability(
    employeeId: string,
    availabilityRequestDto: AvailabilityRequestDto,
  ) {
    const { date } = availabilityRequestDto;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const workingHours = await this.getEmployeeWorkingHours(
      employeeId,
      startOfDay,
    );
  }

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

  async cancelBooking(
    bookingId: string,
    clientId: string,
  ): Promise<ActionResponseDto> {
    const booking = await this.getBookingAggregate(bookingId);

    const cancelResponse = await this.prisma.$transaction(async (tx) => {
      await this.validateBookingOwnership(booking, clientId);

      await tx.bookings.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      const { depositPayment, balancePayment } =
        await this.extractPayments(booking);

      const refunds = this.buildRefunds(
        depositPayment,
        balancePayment,
        booking.startTime,
      );

      await this.paymentService.createRefundPayment(
        {
          bookingId,
          clientId,
          refunds,
        },
        tx,
      );

      return { message: 'Booking succesfully cancelled' };
    });

    await this.notificationsService.create(clientId, {
      content: `Your booking is confirmed for ${booking.service.name} at ${booking.salon.name} on ${booking.startTime.toLocaleString()} with ${booking.employee.name}.`,
      type: NotificationType.CANCELLED,
    });

    return cancelResponse;
  }

  private async validateBookingOwnership(booking: any, clientId: string) {
    if (booking.clientId !== clientId)
      throw new ConflictException(
        VALIDATION_MESSAGES.BOOKING_DOES_NOT_BELONG_TO_CLIENT,
      );
  }

  private async extractPayments(booking: BookingAggregate) {
    const depositPayment = booking.payments.find(
      (p) => p.type === PaymentType.DEPOSIT,
    );

    if (!depositPayment)
      throw new BadRequestException(ErrorMessages.notFound('Deposit'));

    const balancePayment = booking.payments.find(
      (p) => p.type === PaymentType.BALANCE,
    );

    if (!balancePayment)
      throw new BadRequestException(ErrorMessages.notFound('Balance'));

    return { depositPayment, balancePayment };
  }

  private buildRefunds(
    depositPayment: Payments,
    balancePayment: Payments,
    startTime: Date,
  ): Refund[] {
    const depositAmount = calculateRefundPolicy(
      startTime,
      depositPayment.amount.toNumber(),
    );

    const balanaceAmount = balancePayment.amount.toNumber();

    return [
      { amount: depositAmount, method: depositPayment.method },
      {
        amount: balanaceAmount,
        method: balancePayment.method,
      },
    ];
  }

  private async getBookingAggregate(bookingId: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        salon: true,
        employee: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(ErrorMessages.notFound('Booking'));
    }

    return booking;
  }
}
