import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialEntity } from './entities/testimonial.entity';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dtos';

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name);

  constructor(
    @InjectRepository(TestimonialEntity)
    private readonly repo: Repository<TestimonialEntity>,
  ) {}

  async findAll(): Promise<TestimonialEntity[]> {
    return this.repo.find({ order: { order: 'ASC' } } as any);
  }

  async findActive(): Promise<TestimonialEntity[]> {
    return this.repo.find({ where: { isActive: true }, order: { order: 'ASC' } } as any);
  }

  async findFeatured(): Promise<TestimonialEntity[]> {
    return this.repo.find({ where: { isActive: true, isFeatured: true }, order: { order: 'ASC' } } as any);
  }

  async findOneById(id: string): Promise<TestimonialEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`Testimonial with id ${id} not found`);
    return item;
  }

  async create(dto: CreateTestimonialDto): Promise<TestimonialEntity> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateTestimonialDto): Promise<TestimonialEntity> {
    const item = await this.findOneById(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
