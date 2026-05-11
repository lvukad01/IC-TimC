import { MailsService } from '@mails/mails.service';
import { Injectable } from '@nestjs/common';
import { BookingEmailInfo } from '@tstypes/booking-email-info';
import { BookingsService } from '../bookings.service';

@Injectable()
export class BookingReminderOrchestrator {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly mailsService: MailsService,
  ) {}

  async sendDailyReminders() {
    const bookings = await this.bookingsService.findTomorrowBookings();
    for (const booking of bookings) {
      const emailContent = this.buildEmail(booking);
      await this.mailsService.sendMail({
        to: booking.client.email,
        subject: 'Appointment reminder',
        content: emailContent,
      });
    }
  }

  private buildEmail(booking: BookingEmailInfo): string {
    return `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px;">

      <h2 style="color: #333;">Appointment Reminder</h2>

      <p>Hi <strong>${booking.client.firstName}</strong>,</p>

      <p>This is a reminder for your upcoming appointment:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Salon:</td>
          <td>${booking.salon.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Service:</td>
          <td>${booking.service.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Service duration:</td>
          <td>${booking.service.durationMin}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Employee:</td>
          <td>${booking.employee.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Time:</td>
          <td>
            ${new Date(booking.startTime).toLocaleString()} -
            ${new Date(booking.endTime).toLocaleString()}
          </td>
        </tr>
      </table>

      <p style="margin-top: 20px;">We look forward to seeing you!</p>

    </div>
  </div>
  `;
  }
}
