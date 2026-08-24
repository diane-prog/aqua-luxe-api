import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessageEntity } from './entities/contact-message.entity';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessagesController } from './contact-messages.controller';
import { HelpersModule } from '../../helpers';
import { MailerModule } from '../../libs/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessageEntity]), HelpersModule, MailerModule],
  controllers: [ContactMessagesController],
  providers: [ContactMessagesService],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {}
