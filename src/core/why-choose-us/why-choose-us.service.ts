import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhyChooseUsEntity } from './entities/why-choose-us.entity';
import { CreateWhyChooseUsDto, UpdateWhyChooseUsDto } from './dtos';

@Injectable()
export class WhyChooseUsService {
  private readonly logger = new Logger(WhyChooseUsService.name);

  constructor(@InjectRepository(WhyChooseUsEntity) private readonly repo: Repository<WhyChooseUsEntity>) {}

  async findAll(): Promise<WhyChooseUsEntity[]> { return this.repo.find({ order: { order: 'ASC' } } as any); }
  async findActive(): Promise<WhyChooseUsEntity[]> { return this.repo.find({ where: { isActive: true }, order: { order: 'ASC' } } as any); }
  async findOneById(id: string): Promise<WhyChooseUsEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`Why choose us with id ${id} not found`);
    return item;
  }
  async create(dto: CreateWhyChooseUsDto): Promise<WhyChooseUsEntity> { return this.repo.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateWhyChooseUsDto): Promise<WhyChooseUsEntity> {
    const item = await this.findOneById(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }
  async remove(id: string): Promise<void> { await this.findOneById(id); await this.repo.softDelete(id); }
}
