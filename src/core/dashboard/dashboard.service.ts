import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../projects/entities/project.entity';
import { ContactMessageEntity } from '../contact-messages/entities/contact-message.entity';
import { QuoteRequestEntity } from '../quote-requests/entities/quote-request.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { ProjectStatusEnum, ContactMessageStatusEnum, QuoteRequestStatusEnum } from '../../common/enum';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(ContactMessageEntity)
    private readonly contactRepo: Repository<ContactMessageEntity>,
    @InjectRepository(QuoteRequestEntity)
    private readonly quoteRepo: Repository<QuoteRequestEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async getStats() {
    const [
      totalProjects,
      publishedProjects,
      totalMessages,
      unreadMessages,
      totalQuotes,
      pendingQuotes,
      totalServices,
    ] = await Promise.all([
      this.projectRepo.count(),
      this.projectRepo.count({ where: { status: ProjectStatusEnum.PUBLISHED } } as any),
      this.contactRepo.count(),
      this.contactRepo.count({ where: { status: ContactMessageStatusEnum.NEW } } as any),
      this.quoteRepo.count(),
      this.quoteRepo.count({ where: { status: QuoteRequestStatusEnum.NEW } } as any),
      this.serviceRepo.count(),
    ]);

    return {
      totalProjects,
      publishedProjects,
      totalMessages,
      unreadMessages,
      totalQuotes,
      pendingQuotes,
      totalServices,
    };
  }

  async getQuoteRequestsByMonth() {
    const quotes = await this.quoteRepo
      .createQueryBuilder('quote')
      .select("TO_CHAR(quote.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(quote.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .limit(12)
      .getRawMany();

    return quotes;
  }

  async getTopServices() {
    const topServices = await this.quoteRepo
      .createQueryBuilder('quote')
      .leftJoin('quote.serviceType', 'service')
      .select('service.title', 'serviceName')
      .addSelect('COUNT(*)', 'requestCount')
      .where('service.title IS NOT NULL')
      .groupBy('service.title')
      .orderBy('requestCount', 'DESC')
      .limit(5)
      .getRawMany();

    return topServices;
  }

  async getRecentQuotes(limit: number = 5) {
    return this.quoteRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: { serviceType: true },
    } as any);
  }

  async getRecentMessages(limit: number = 5) {
    return this.contactRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    } as any);
  }
}
