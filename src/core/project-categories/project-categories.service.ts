import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectCategoryEntity } from './entities/project-category.entity';
import { CreateProjectCategoryDto, UpdateProjectCategoryDto } from './dtos';

@Injectable()
export class ProjectCategoriesService {
  private readonly logger = new Logger(ProjectCategoriesService.name);

  constructor(
    @InjectRepository(ProjectCategoryEntity)
    private readonly repo: Repository<ProjectCategoryEntity>,
  ) {}

  async findAll(): Promise<ProjectCategoryEntity[]> {
    return this.repo.find({ order: { order: 'ASC' } } as any);
  }

  async findOneById(id: string): Promise<ProjectCategoryEntity> {
    const cat = await this.repo.findOne({ where: { id } as any });
    if (!cat) throw new NotFoundException(`Project category with id ${id} not found`);
    return cat;
  }

  async create(dto: CreateProjectCategoryDto): Promise<ProjectCategoryEntity> {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Category with slug ${dto.slug} already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateProjectCategoryDto): Promise<ProjectCategoryEntity> {
    const cat = await this.findOneById(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
