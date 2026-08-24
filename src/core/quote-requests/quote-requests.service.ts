import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRequestEntity } from './entities/quote-request.entity';
import { CreateQuoteRequestDto, UpdateQuoteRequestStatusDto } from './dtos';
import { QuoteRequestStatusEnum } from '../../common/enum';
import { AdminGateway } from '../../helpers';
import { MailerService } from '../../libs/mailer';

@Injectable()
export class QuoteRequestsService {
  private readonly logger = new Logger(QuoteRequestsService.name);

  constructor(
    @InjectRepository(QuoteRequestEntity)
    private readonly repo: Repository<QuoteRequestEntity>,
    private readonly gateway: AdminGateway,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(): Promise<QuoteRequestEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' }, relations: { serviceType: true } } as any);
  }

  async findOneById(id: string): Promise<QuoteRequestEntity> {
    const item = await this.repo.findOne({ where: { id }, relations: { serviceType: true } } as any);
    if (!item) throw new NotFoundException(`Quote request with id ${id} not found`);
    return item;
  }

  async findPendingCount(): Promise<number> {
    return this.repo.count({ where: { status: QuoteRequestStatusEnum.NEW } } as any);
  }

  async findByStatus(status: QuoteRequestStatusEnum): Promise<QuoteRequestEntity[]> {
    return this.repo.find({ where: { status }, order: { createdAt: 'DESC' }, relations: { serviceType: true } } as any);
  }

  async create(dto: CreateQuoteRequestDto): Promise<QuoteRequestEntity> {
    const request = this.repo.create(dto);
    const saved = await this.repo.save(request);

    this.gateway.emitNewQuoteRequest(saved);
    await this.mailerService.sendQuoteConfirmation(dto.email, dto.fullName);

    return saved;
  }

  async updateStatus(id: string, dto: UpdateQuoteRequestStatusDto): Promise<QuoteRequestEntity> {
    const item = await this.findOneById(id);
    item.status = dto.status;
    if (dto.notes) item.notes = dto.notes;
    if (dto.estimatedPrice) item.estimatedPrice = dto.estimatedPrice;
    return this.repo.save(item);
  }

  async addAttachment(
    id: string,
    attachment: { url: string; publicId: string },
  ): Promise<QuoteRequestEntity> {
    const item = await this.findOneById(id);
    item.attachments = [...(item.attachments || []), attachment];
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
