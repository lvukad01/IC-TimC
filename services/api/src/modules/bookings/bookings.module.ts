import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingReminderCron } from './cron/booking-cron.service';
import { BookingReminderOrchestrator } from './orchestrators/booking-reminder.orchestrator';
import {
  SalonBookingsController,
  BookingsController,
} from './bookings.controller';
@Module({
  controllers: [BookingsController, SalonBookingsController],
  providers: [
    BookingsService,
    BookingReminderOrchestrator,
    BookingReminderCron,
  ],
})
export class AppointmentsModule {}
