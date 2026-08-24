import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { ProjectStatusEnum } from '../../common/enum';
import { CloudinaryService } from '../../libs/cloudinary';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({ order: { order: 'ASC' }, relations: { category: true } } as any);
  }

  async findPublished(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({
      where: { status: ProjectStatusEnum.PUBLISHED },
      order: { order: 'ASC' },
      relations: { category: true },
    } as any);
  }

  async findOneById(id: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id }, relations: { category: true } } as any);
    if (!project) throw new NotFoundException(`Project with id ${id} not found`);
    return project;
  }

  async findBySlug(slug: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { slug }, relations: { category: true } } as any);
    if (!project) throw new NotFoundException(`Project with slug ${slug} not found`);
    return project;
  }

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const exists = await this.projectRepository.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Project with slug ${dto.slug} already exists`);
    const project = this.projectRepository.create(dto);
    return this.projectRepository.save(project);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.findOneById(id);
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async addImage(id: string, image: { url: string; publicId: string }): Promise<ProjectEntity> {
    const project = await this.findOneById(id);
    project.images = [...(project.images || []), image];
    return this.projectRepository.save(project);
  }

  async removeImage(id: string, publicId: string): Promise<ProjectEntity> {
    const project = await this.findOneById(id);
    await this.cloudinaryService.deleteImage(publicId);
    project.images = (project.images || []).filter(img => img.publicId !== publicId);
    return this.projectRepository.save(project);
  }

  async setBeforeAfterImages(
    id: string,
    beforeImage?: { url: string; publicId: string },
    afterImage?: { url: string; publicId: string },
  ): Promise<ProjectEntity> {
    const project = await this.findOneById(id);
    if (beforeImage) {
      project.beforeImage = beforeImage.url;
      project.beforeImagePublicId = beforeImage.publicId;
    }
    if (afterImage) {
      project.afterImage = afterImage.url;
      project.afterImagePublicId = afterImage.publicId;
    }
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOneById(id);
    if (project.images) {
      for (const img of project.images) {
        await this.cloudinaryService.deleteImage(img.publicId);
      }
    }
    if (project.beforeImagePublicId) await this.cloudinaryService.deleteImage(project.beforeImagePublicId);
    if (project.afterImagePublicId) await this.cloudinaryService.deleteImage(project.afterImagePublicId);
    await this.projectRepository.softDelete(id);
  }
}
