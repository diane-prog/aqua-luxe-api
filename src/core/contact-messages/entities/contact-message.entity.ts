import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { ContactMessageStatusEnum } from '../../../common/enum';

@Entity('contact_messages')
export class ContactMessageEntity extends AbstractEntity<ContactMessageEntity> {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ContactMessageStatusEnum, default: ContactMessageStatusEnum.NEW })
  status: ContactMessageStatusEnum;

  @Column({ nullable: true })
  repliedAt: Date;
}
