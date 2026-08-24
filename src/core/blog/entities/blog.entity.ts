import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { BlogStatusEnum } from '../../../common/enum';
import { UserEntity } from '../../users/entities/user.entity';
import { BlogCategoryEntity } from '../../blog-categories/entities/blog-category.entity';

@Entity('blog')
export class BlogEntity extends AbstractEntity<BlogEntity> {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  excerpt: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  coverImagePublicId: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  @ManyToOne(() => BlogCategoryEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: BlogCategoryEntity;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'enum', enum: BlogStatusEnum, default: BlogStatusEnum.DRAFT })
  status: BlogStatusEnum;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  readingTime: number;

  @Column({ nullable: true })
  seoTitle: string;

  @Column({ nullable: true })
  seoDescription: string;
}
