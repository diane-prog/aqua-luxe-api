import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { ServiceCategoryEnum } from '../../../common/enum';

@Entity('services')
export class ServiceEntity extends AbstractEntity<ServiceEntity> {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  coverImagePublicId: string;

  @Column('simple-array', { nullable: true })
  features: string[];

  @Column({ type: 'enum', enum: ServiceCategoryEnum, default: ServiceCategoryEnum.CONSTRUCTION })
  category: ServiceCategoryEnum;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}
