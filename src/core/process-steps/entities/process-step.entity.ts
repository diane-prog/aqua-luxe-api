import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('process_steps')
export class ProcessStepEntity extends AbstractEntity<ProcessStepEntity> {
  @Column({ type: 'int' })
  stepNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}