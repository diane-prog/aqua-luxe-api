import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProjectEntity } from '../projects/entities/project.entity';
import { ContactMessageEntity } from '../contact-messages/entities/contact-message.entity';
import { QuoteRequestEntity } from '../quote-requests/entities/quote-request.entity';
import { ServiceEntity } from '../services/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ContactMessageEntity,
      QuoteRequestEntity,
      ServiceEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
