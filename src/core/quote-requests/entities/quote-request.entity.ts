import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { QuoteRequestStatusEnum } from '../../../common/enum';
import { ServiceEntity } from '../../services/entities/service.entity';

@Entity('quote_requests')
export class QuoteRequestEntity extends AbstractEntity<QuoteRequestEntity> {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => ServiceEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceEntity;

  @Column({ name: 'service_type_id', nullable: true })
  serviceTypeId: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  budgetRange: string;

  @Column({ nullable: true })
  preferredDate: Date;

  @Column('simple-json', { nullable: true })
  attachments: { url: string; publicId: string }[];

  @Column({ type: 'enum', enum: QuoteRequestStatusEnum, default: QuoteRequestStatusEnum.NEW })
  status: QuoteRequestStatusEnum;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  estimatedPrice: number;
}
