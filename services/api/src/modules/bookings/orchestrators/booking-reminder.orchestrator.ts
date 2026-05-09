import { MailsService } from '@mails/mails.service';
import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings.service';

@Injectable()
export class BookingReminderOrchestrator {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly mailsService: MailsService,
  ) {}

  async sendDailyReminders() {
    const bookings = await this.bookingsService.findTomorrowAppointments();

    for (const booking of bookings) {
      const emailContent = this.buildEmail(booking);

      await this.mailsService.sendMail({
        to: booking.user.email,
        subject: 'Appointment reminder',
        content: emailContent,
      });
    }
  }

  private buildEmail(booking: any): string {
    return `
    Hi ${booking.user.firstName},

    This is a reminder for your appointment:

    Salon: ${booking.salon.name}
    Date: ${booking.date}
    Time: ${booking.startTime} - ${booking.endTime}
    Employee: ${booking.employee.firstName}- ${booking.employee.lastName}

    See you soon!
  `;
  }
}
