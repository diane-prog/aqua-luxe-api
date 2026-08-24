import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('why_choose_us')
export class WhyChooseUsEntity extends AbstractEntity<WhyChooseUsEntity> {
  @Column({ nullable: true })
  icon: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}