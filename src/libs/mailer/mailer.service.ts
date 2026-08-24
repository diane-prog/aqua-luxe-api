import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM', 'noreply@poolbk.com'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
    }
  }

  async sendQuoteConfirmation(to: string, name: string): Promise<void> {
    await this.sendMail(
      to,
      'Quote Request Received - Pooluxe',
      `<h2>Thank you, ${name}!</h2>
       <p>We have received your quote request and will get back to you within 24 hours.</p>
       <p>Best regards,<br/>The Pooluxe Team</p>`,
    );
  }

  async sendContactConfirmation(to: string, name: string): Promise<void> {
    await this.sendMail(
      to,
      'Message Received - Pooluxe',
      `<h2>Thank you, ${name}!</h2>
       <p>We have received your message and will respond shortly.</p>
       <p>Best regards,<br/>The Pooluxe Team</p>`,
    );
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;
    await this.sendMail(
      to,
      'Password Reset - Pooluxe',
      `<h2>Password Reset Request</h2>
       <p>Click the link below to reset your password:</p>
       <a href="${resetUrl}">Reset Password</a>
       <p>This link expires in 1 hour.</p>`,
    );
  }
}
