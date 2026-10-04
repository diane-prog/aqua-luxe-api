import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { CreateRoleDto, UpdateRoleDto } from './dtos';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({ relations: { permissions: true } } as any);
  }

  async findOneById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id } as any,
      relations: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async findOneByName(name: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({ where: { name } as any });
  }

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const exists = await this.roleRepository.findOne({
      where: { name: dto.name } as any,
    });
    if (exists) {
      throw new ConflictException(`Role ${dto.name} already exists`);
    }
    await this.validatePermissionIds(dto.permissionIds);
    const role = this.roleRepository.create({ name: dto.name, description: dto.description });
    return this.roleRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOneById(id);
    await this.validatePermissionIds(dto.permissionIds);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  private async validatePermissionIds(permissionIds: string[] | undefined): Promise<void> {
    if (permissionIds && permissionIds.length > 0) {
      const validPermissions = await this.permissionRepository.findBy({ id: In(permissionIds) } as any);
      if (validPermissions.length !== permissionIds.length) {
        const invalidIds = permissionIds.filter(id => !validPermissions.some(p => p.id === id));
        throw new BadRequestException(`Permission(s) with id(s) '${invalidIds.join(', ')}' not found`);
      }
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.roleRepository.softDelete(id);
  }
}
