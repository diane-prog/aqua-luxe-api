import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { MailerModule } from '../../libs/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity]), MailerModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
