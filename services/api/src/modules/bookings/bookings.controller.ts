import { ActionResponseDto } from '@common/common';
import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestWithJwtUser } from '@tstypes/request-types';
import { BookingsService } from './bookings.service';
import { AvailabilityRequestDto } from './dto/availability-request.dto';
import { AvailabilityResponseDto } from './dto/avaliability-response.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import type { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
@RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @RolesAuth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiOkResponse({ type: BookingResponseDto, isArray: true })
  getAllBookings(@Req() req: RequestWithJwtUser) {
    return this.bookingsService.findAllBookings(req.user.sub);
  }

  @Get('availability/:employeeId')
  @ApiOperation({ summary: 'Get available time slots for an employee' })
  @ApiOkResponse({ type: AvailabilityResponseDto, isArray: true })
  getAvailability(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() dto: AvailabilityRequestDto,
  ) {
    return this.bookingsService.findAvailability(employeeId, dto);
  }

  @Get(':id')
  @RolesAuth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiOkResponse({ type: BookingResponseDto })
  getBookingById(@Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingsService.findBookingById(bookingId);
  }

  @Post()
  @RolesAuth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({ type: BookingResponseDto })
  createBooking(
    @Req() req: RequestWithJwtUser,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(req.user.sub, createBookingDto);
  }

  @Patch(':id/cancel')
  @RolesAuth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Cancel user booking' })
  @ApiOkResponse({ type: ActionResponseDto })
  cancelBooking(
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Req() req: RequestWithJwtUser,
  ) {
    return this.bookingsService.cancelBooking(bookingId, req.user.sub);
  }

  @Delete(':id')
  @RolesAuth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiOkResponse({ type: ActionResponseDto })
  deleteBooking(@Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingsService.deleteBooking(bookingId);
  }
}

@ApiTags('salon-bookings')
@RolesAuth(UserRole.SALON_OWNER, UserRole.ADMIN)
@Controller('salons/:salonId/bookings')
export class SalonBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings for a salon' })
  @ApiOkResponse({ type: BookingResponseDto, isArray: true })
  getSalonBookings(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.bookingsService.findBookingsForSalon(salonId, employeeId);
  }
}

@ApiTags('booking-stats')
@Controller('booking-stats')
export class BookingsCountController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('today-count')
  @ApiOperation({ summary: 'Get number of bookings created today' })
  getTodayBookingsCount() {
    return this.bookingsService.countTodayBookings();
  }
}
