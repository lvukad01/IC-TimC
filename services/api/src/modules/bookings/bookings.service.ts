import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  async findAllBookings() {}

  async findBookingById(bookingId: string) {}

  async createBooking(userId: string, createBookingDto: any) {}

  async updateBookingStatus(bookingId: string, status: string) {}
  async findBookingsForEmployee(employeeId: string) {}
}
