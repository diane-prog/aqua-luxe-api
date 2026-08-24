import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dtos';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async findAll(): Promise<ServiceEntity[]> {
    return this.serviceRepository.find({ order: { order: 'ASC' } } as any);
  }

  async findActive(): Promise<ServiceEntity[]> {
    return this.serviceRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    } as any);
  }

  async findOneById(id: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } as any });
    if (!service) throw new NotFoundException(`Service with id ${id} not found`);
    return service;
  }

  async findBySlug(slug: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { slug } as any });
    if (!service) throw new NotFoundException(`Service with slug ${slug} not found`);
    return service;
  }

  async create(dto: CreateServiceDto): Promise<ServiceEntity> {
    const exists = await this.serviceRepository.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Service with slug ${dto.slug} already exists`);
    const service = this.serviceRepository.create(dto);
    return this.serviceRepository.save(service);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceEntity> {
    const service = await this.findOneById(id);
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.serviceRepository.softDelete(id);
  }
}
