import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqEntity } from './entities/faq.entity';
import { CreateFaqDto, UpdateFaqDto } from './dtos';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);

  constructor(
    @InjectRepository(FaqEntity)
    private readonly repo: Repository<FaqEntity>,
  ) {}

  async findAll(): Promise<FaqEntity[]> {
    return this.repo.find({ order: { order: 'ASC' } } as any);
  }

  async findActive(): Promise<FaqEntity[]> {
    return this.repo.find({ where: { isActive: true }, order: { order: 'ASC' } } as any);
  }

  async findOneById(id: string): Promise<FaqEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`FAQ with id ${id} not found`);
    return item;
  }

  async create(dto: CreateFaqDto): Promise<FaqEntity> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateFaqDto): Promise<FaqEntity> {
    const item = await this.findOneById(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
