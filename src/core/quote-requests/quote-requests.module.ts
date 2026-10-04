import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteRequestEntity } from './entities/quote-request.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { QuoteRequestsService } from './quote-requests.service';
import { QuoteRequestsController } from './quote-requests.controller';
import { HelpersModule } from '../../helpers';
import { MailerModule } from '../../libs/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteRequestEntity, ServiceEntity]), HelpersModule, MailerModule],
  controllers: [QuoteRequestsController],
  providers: [QuoteRequestsService],
  exports: [QuoteRequestsService],
})
export class QuoteRequestsModule {}
