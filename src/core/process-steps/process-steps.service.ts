import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessStepEntity } from './entities/process-step.entity';
import { CreateProcessStepDto, UpdateProcessStepDto } from './dtos';

@Injectable()
export class ProcessStepsService {
  private readonly logger = new Logger(ProcessStepsService.name);

  constructor(@InjectRepository(ProcessStepEntity) private readonly repo: Repository<ProcessStepEntity>) {}

  async findAll(): Promise<ProcessStepEntity[]> { return this.repo.find({ order: { order: 'ASC' } } as any); }
  async findActive(): Promise<ProcessStepEntity[]> { return this.repo.find({ where: { isActive: true }, order: { order: 'ASC' } } as any); }
  async findOneById(id: string): Promise<ProcessStepEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`Process step with id ${id} not found`);
    return item;
  }
  async create(dto: CreateProcessStepDto): Promise<ProcessStepEntity> { return this.repo.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateProcessStepDto): Promise<ProcessStepEntity> {
    const item = await this.findOneById(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }
  async remove(id: string): Promise<void> { await this.findOneById(id); await this.repo.softDelete(id); }
}
