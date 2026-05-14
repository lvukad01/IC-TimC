import { Module } from '@nestjs/common';
import { PaymentsModule } from '@payments/payments.module';
import { SalonsModule } from '@salons/salons.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  BookingsController,
  BookingsCountController,
  SalonBookingsController,
} from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingReminderCron } from './cron/booking-cron.service';
import { BookingReminderOrchestrator } from './orchestrators/booking-reminder.orchestrator';
import { MailsModule } from '@mails/mails.module';
@Module({
  controllers: [
    BookingsController,
    SalonBookingsController,
    BookingsCountController,
  ],
  providers: [
    BookingsService,
    BookingReminderOrchestrator,
    BookingReminderCron,
  ],
  imports: [PaymentsModule, SalonsModule, NotificationsModule, MailsModule],
})
export class AppointmentsModule {}
