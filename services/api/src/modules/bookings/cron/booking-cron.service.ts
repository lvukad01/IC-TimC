import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingReminderOrchestrator } from '../orchestrators/booking-reminder.orchestrator';

@Injectable()
export class BookingReminderCron {
  constructor(private readonly orchestrator: BookingReminderOrchestrator) {}

  @Cron('0 8 * * *', { timeZone: 'Europe/Zagreb' })
  async handleDailyReminders() {
    await this.orchestrator.sendDailyReminders();
  }
}
