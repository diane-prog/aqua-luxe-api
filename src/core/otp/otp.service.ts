import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpEntity } from './entities/otp.entity';
import { MailerService } from '../../libs/mailer/mailer.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepo: Repository<OtpEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async generateAndSend(email: string): Promise<{ message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpRepo.save(
      this.otpRepo.create({ email, code, expiresAt }),
    );

    await this.mailerService.sendMail(
      email,
      'Your Verification Code - Pooluxe',
      `<h2>Your OTP Code</h2>
       <p>Your verification code is: <strong style="font-size:24px;letter-spacing:4px">${code}</strong></p>
       <p>This code expires in 10 minutes.</p>
       <p>If you didn't request this, ignore this email.</p>`,
    );

    this.logger.log(`OTP sent to ${email}`);
    return { message: `Verification code sent to ${email}` };
  }

  async verify(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepo.findOne({
      where: { email, code, used: false } as any,
    } as any);

    if (!otp) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    otp.used = true;
    await this.otpRepo.save(otp);

    return true;
  }
}
