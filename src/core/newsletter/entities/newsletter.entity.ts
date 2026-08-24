import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('newsletter')
export class NewsletterEntity extends AbstractEntity<NewsletterEntity> {
  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  subscribedAt: Date;

  @Column({ nullable: true })
  unsubscribedAt: Date;
}
