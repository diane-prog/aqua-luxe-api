import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from '../users/entities/user.entity';
import { BlogCategoryEntity } from '../blog-categories/entities/blog-category.entity';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { BlogStatusEnum } from '../../common/enum';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(BlogEntity)
    private readonly repo: Repository<BlogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlogCategoryEntity)
    private readonly categoryRepository: Repository<BlogCategoryEntity>,
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
    await this.validateForeignKeys(dto.authorId, dto.categoryId);
    if (dto.status === BlogStatusEnum.PUBLISHED && !(dto as any).publishedAt) {
      (dto as any).publishedAt = new Date();
    }
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateBlogDto): Promise<BlogEntity> {
    const item = await this.findOneById(id);
    await this.validateForeignKeys(dto.authorId, dto.categoryId);
    if (dto.status === BlogStatusEnum.PUBLISHED && item.status !== BlogStatusEnum.PUBLISHED && !(dto as any).publishedAt) {
      (dto as any).publishedAt = new Date();
    }
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  private async validateForeignKeys(authorId: string | undefined, categoryId: string | undefined): Promise<void> {
    if (authorId) {
      const author = await this.userRepository.findOne({ where: { id: authorId } as any });
      if (!author) {
        throw new BadRequestException(`Author with id '${authorId}' not found`);
      }
    }
    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } as any });
      if (!category) {
        throw new BadRequestException(`Category with id '${categoryId}' not found`);
      }
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
