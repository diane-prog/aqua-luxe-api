import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dtos';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
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
    const role = this.roleRepository.create({ name: dto.name, description: dto.description });
    return this.roleRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOneById(id);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.roleRepository.softDelete(id);
  }
}
