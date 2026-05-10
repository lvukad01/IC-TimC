import { Module } from '@nestjs/common';
import { PaymentsModule } from '@payments/payments.module';
import { SalonsModule } from '@salons/salons.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  BookingsController,
  SalonBookingsController,
} from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingReminderCron } from './cron/booking-cron.service';
import { BookingReminderOrchestrator } from './orchestrators/booking-reminder.orchestrator';
@Module({
  controllers: [BookingsController, SalonBookingsController],
  providers: [
    BookingsService,
    BookingReminderOrchestrator,
    BookingReminderCron,
  ],
  imports: [PaymentsModule, SalonsModule, NotificationsModule],
})
export class AppointmentsModule {}
