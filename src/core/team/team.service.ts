import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto, UpdateTeamDto } from './dtos';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(@InjectRepository(TeamEntity) private readonly repo: Repository<TeamEntity>) {}

  async findAll(): Promise<TeamEntity[]> { return this.repo.find({ order: { order: 'ASC' } } as any); }
  async findActive(): Promise<TeamEntity[]> { return this.repo.find({ where: { isActive: true }, order: { order: 'ASC' } } as any); }
  async findOneById(id: string): Promise<TeamEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`Team member with id ${id} not found`);
    return item;
  }
  async create(dto: CreateTeamDto): Promise<TeamEntity> { return this.repo.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateTeamDto): Promise<TeamEntity> {
    const item = await this.findOneById(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }
  async remove(id: string): Promise<void> { await this.findOneById(id); await this.repo.softDelete(id); }
}
