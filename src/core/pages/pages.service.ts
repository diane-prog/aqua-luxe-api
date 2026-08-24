import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageEntity } from './entities/page.entity';
import { CreatePageDto, UpdatePageDto } from './dtos';

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);

  constructor(
    @InjectRepository(PageEntity)
    private readonly repo: Repository<PageEntity>,
  ) {}

  async findAll(): Promise<PageEntity[]> {
    return this.repo.find({ order: { title: 'ASC' } } as any);
  }

  async findActive(): Promise<PageEntity[]> {
    return this.repo.find({ where: { isActive: true } } as any);
  }

  async findOneById(id: string): Promise<PageEntity> {
    const page = await this.repo.findOne({ where: { id } as any });
    if (!page) throw new NotFoundException(`Page with id ${id} not found`);
    return page;
  }

  async findBySlug(slug: string): Promise<PageEntity> {
    const page = await this.repo.findOne({ where: { slug } as any });
    if (!page) throw new NotFoundException(`Page with slug ${slug} not found`);
    return page;
  }

  async create(dto: CreatePageDto): Promise<PageEntity> {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } as any });
    if (exists) throw new ConflictException(`Page with slug ${dto.slug} already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdatePageDto): Promise<PageEntity> {
    const page = await this.findOneById(id);
    Object.assign(page, dto);
    return this.repo.save(page);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
