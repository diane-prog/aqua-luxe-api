import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessageEntity } from './entities/contact-message.entity';
import { CreateContactMessageDto, UpdateContactMessageStatusDto } from './dtos';
import { ContactMessageStatusEnum } from '../../common/enum';
import { AdminGateway } from '../../helpers';
import { MailerService } from '../../libs/mailer';

@Injectable()
export class ContactMessagesService {
  private readonly logger = new Logger(ContactMessagesService.name);

  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly repo: Repository<ContactMessageEntity>,
    private readonly gateway: AdminGateway,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(): Promise<ContactMessageEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } } as any);
  }

  async findOneById(id: string): Promise<ContactMessageEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException(`Contact message with id ${id} not found`);
    return item;
  }

  async findUnreadCount(): Promise<number> {
    return this.repo.count({ where: { status: ContactMessageStatusEnum.NEW } } as any);
  }

  async create(dto: CreateContactMessageDto): Promise<ContactMessageEntity> {
    const message = this.repo.create(dto);
    const saved = await this.repo.save(message);

    this.gateway.emitNewContactMessage(saved);
    await this.mailerService.sendContactConfirmation(dto.email, dto.fullName);

    return saved;
  }

  async updateStatus(id: string, dto: UpdateContactMessageStatusDto): Promise<ContactMessageEntity> {
    const item = await this.findOneById(id);
    item.status = dto.status;
    if (dto.status === ContactMessageStatusEnum.REPLIED) {
      item.repliedAt = new Date();
    }
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.repo.softDelete(id);
  }
}
