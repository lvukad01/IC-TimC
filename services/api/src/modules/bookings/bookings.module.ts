import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingReminderCron } from './cron/booking-cron.service';
import { BookingReminderOrchestrator } from './orchestrators/booking-reminder.orchestrator';
@Module({
  providers: [
    BookingsService,
    BookingReminderOrchestrator,
    BookingReminderCron,
  ],
})
export class AppointmentsModule {}
