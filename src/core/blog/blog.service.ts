import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { BlogStatusEnum } from '../../common/enum';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(BlogEntity)
    private readonly repo: Repository<BlogEntity>,
  ) {}

  async findAll(): Promise<BlogEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' }, relations: { author: true, category: true } } as any);
  }

  async findPublished(): Promise<BlogEntity[]> {
    return this.repo.find({
      where: { status: BlogStatusEnum.PUBLISHED },
      order: { publishedAt: 'DESC' },
      relations: { author: true, category: true },
    } as any);
  }

  async findOneById(id: string): Promise<BlogEntity> {
    const item = await this.repo.findOne({ where: { id }, relations: { author: true, category: true } } as any);
    if (!item) throw new NotFoundException(`Blog post with id ${id} not found`);
    return item;
  }

  async findBySlug(slug: string): Promise<BlogEntity> {
    const item = await this.repo.findOne({ where: { slug }, relations: { author: true, category: true } } as any);
    if (!item) throw new NotFoundException(`Blog post with slug ${slug} not found`);
    return item;
  }

  async create(dto: CreateBlogDto): Promise<BlogEntity> {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Blog post with slug ${dto.slug} already exists`);
    if (dto.status === BlogStatusEnum.PUBLISHED && !(dto as any).publishedAt) {
      (dto as any).publishedAt = new Date();
    }
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateBlogDto): Promise<BlogEntity> {
    const item = await this.findOneById(id);
    if (dto.status === BlogStatusEnum.PUBLISHED && item.status !== BlogStatusEnum.PUBLISHED && !(dto as any).publishedAt) {
      (dto as any).publishedAt = new Date();
    }
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
