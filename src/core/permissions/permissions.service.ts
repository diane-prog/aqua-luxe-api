import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find();
  }

  async findOneById(id: string): Promise<PermissionEntity> {
    const perm = await this.permissionRepository.findOne({ where: { id } as any });
    if (!perm) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return perm;
  }

  async findByName(name: string): Promise<PermissionEntity | null> {
    return this.permissionRepository.findOne({ where: { name } as any });
  }
}
