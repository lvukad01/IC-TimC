import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import { CreateBookingDto } from './dto/create-booking.dto';
import type { RequestWithJwtUser } from '@tstypes/request-types';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ description: 'Get all bookings' })
  getAllBookings(@Req() req: RequestWithJwtUser) {
    return this.bookingsService.findAllBookings();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get booking by ID' })
  getBookingById(@Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingsService.findBookingById(bookingId);
  }

  @Post()
  @RolesAuth(UserRole.CLIENT)
  createBooking(
    @Req() req: RequestWithJwtUser,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(req.user.sub, createBookingDto);
  }
}

@RolesAuth(UserRole.SALON_OWNER, UserRole.ADMIN)
@Controller('salons/:salonId/employees/:employeeId/bookings')
export class SalonBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ description: 'Get all bookings for a specific employee' })
  getEmployeeBookings(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.bookingsService.findBookingsForEmployee(employeeId);
  }

  @Patch(':bookingId/status')
  @ApiOperation({ description: 'Update the status of a specific booking' })
  updateBookingStatus(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(bookingId, dto.status);
  }
}
