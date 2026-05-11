import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailPayload } from '@tstypes/send-mail';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(payload: SendMailPayload) {
    const { to, subject, content } = payload;
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    await this.transporter.sendMail({
      from: `"Lumii" <${from}>`,
      to,
      subject,
      html: content,
    });
  }
}
