import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterEntity } from './entities/newsletter.entity';
import { SubscribeNewsletterDto } from './dtos';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectRepository(NewsletterEntity)
    private readonly repo: Repository<NewsletterEntity>,
  ) {}

  async findAll(): Promise<NewsletterEntity[]> {
    return this.repo.find({ order: { subscribedAt: 'DESC' } } as any);
  }

  async findActive(): Promise<NewsletterEntity[]> {
    return this.repo.find({ where: { isActive: true } } as any);
  }

  async subscribe(dto: SubscribeNewsletterDto): Promise<NewsletterEntity> {
    const existing = await this.repo.findOne({ where: { email: dto.email } as any });
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Email is already subscribed');
      }
      existing.isActive = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      return this.repo.save(existing);
    }
    const subscriber = this.repo.create({
      email: dto.email,
      isActive: true,
      subscribedAt: new Date(),
    });
    return this.repo.save(subscriber);
  }

  async unsubscribe(email: string): Promise<void> {
    const subscriber = await this.repo.findOne({ where: { email } as any });
    if (!subscriber) throw new NotFoundException('Email not found');
    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await this.repo.save(subscriber);
  }

  async getActiveCount(): Promise<number> {
    return this.repo.count({ where: { isActive: true } } as any);
  }
}
