import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from './entities/package.entity';
import { CreatePackageDto, UpdatePackageDto } from './dtos';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}

  async findAll(): Promise<PackageEntity[]> {
    return this.packageRepository.find({ order: { order: 'ASC' } } as any);
  }

  async findActive(): Promise<PackageEntity[]> {
    return this.packageRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    } as any);
  }

  async findOneById(id: string): Promise<PackageEntity> {
    const pkg = await this.packageRepository.findOne({ where: { id } as any });
    if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);
    return pkg;
  }

  async create(dto: CreatePackageDto): Promise<PackageEntity> {
    const pkg = this.packageRepository.create(dto);
    return this.packageRepository.save(pkg);
  }

  async update(id: string, dto: UpdatePackageDto): Promise<PackageEntity> {
    const pkg = await this.findOneById(id);
    Object.assign(pkg, dto);
    return this.packageRepository.save(pkg);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.packageRepository.softDelete(id);
  }
}
