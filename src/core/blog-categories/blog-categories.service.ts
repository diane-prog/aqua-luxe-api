import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dtos';

@Injectable()
export class BlogCategoriesService {
  private readonly logger = new Logger(BlogCategoriesService.name);

  constructor(
    @InjectRepository(BlogCategoryEntity)
    private readonly repo: Repository<BlogCategoryEntity>,
  ) {}

  async findAll(): Promise<BlogCategoryEntity[]> {
    return this.repo.find({ order: { order: 'ASC' } } as any);
  }

  async findOneById(id: string): Promise<BlogCategoryEntity> {
    const cat = await this.repo.findOne({ where: { id } as any });
    if (!cat) throw new NotFoundException(`Blog category with id ${id} not found`);
    return cat;
  }

  async findBySlug(slug: string): Promise<BlogCategoryEntity | null> {
    return this.repo.findOne({ where: { slug } as any });
  }

  async create(dto: CreateBlogCategoryDto): Promise<BlogCategoryEntity> {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Blog category with slug ${dto.slug} already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateBlogCategoryDto): Promise<BlogCategoryEntity> {
    const cat = await this.findOneById(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
