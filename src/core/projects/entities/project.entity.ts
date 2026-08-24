import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { ProjectStatusEnum } from '../../../common/enum';
import { ProjectCategoryEntity } from '../../project-categories/entities/project-category.entity';

@Entity('projects')
export class ProjectEntity extends AbstractEntity<ProjectEntity> {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  completionDays: number;

  @ManyToOne(() => ProjectCategoryEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ProjectCategoryEntity;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column('simple-json', { nullable: true })
  images: { url: string; publicId: string }[];

  @Column({ nullable: true })
  beforeImage: string;

  @Column({ nullable: true })
  beforeImagePublicId: string;

  @Column({ nullable: true })
  afterImage: string;

  @Column({ nullable: true })
  afterImagePublicId: string;

  @Column({ nullable: true })
  client: string;

  @Column({ type: 'enum', enum: ProjectStatusEnum, default: ProjectStatusEnum.DRAFT })
  status: ProjectStatusEnum;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ default: 0 })
  order: number;
}
