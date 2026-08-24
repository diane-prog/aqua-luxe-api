import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyChooseUsEntity } from './entities/why-choose-us.entity';
import { WhyChooseUsService } from './why-choose-us.service';
import { WhyChooseUsController } from './why-choose-us.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WhyChooseUsEntity])],
  controllers: [WhyChooseUsController],
  providers: [WhyChooseUsService],
  exports: [WhyChooseUsService],
})
export class WhyChooseUsModule {}