import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessStepEntity } from './entities/process-step.entity';
import { ProcessStepsService } from './process-steps.service';
import { ProcessStepsController } from './process-steps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessStepEntity])],
  controllers: [ProcessStepsController],
  providers: [ProcessStepsService],
  exports: [ProcessStepsService],
})
export class ProcessStepsModule {}