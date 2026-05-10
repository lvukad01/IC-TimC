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
import type { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

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

  @Delete(':id')
  @RolesAuth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiOkResponse({ description: 'Booking deleted successfully' })
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

  @Patch(':bookingId/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiOkResponse({ type: BookingResponseDto })
  updateBookingStatus(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(bookingId, dto.status);
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
}
