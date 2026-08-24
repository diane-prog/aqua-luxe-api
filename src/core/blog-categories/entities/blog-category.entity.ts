import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('blog_categories')
export class BlogCategoryEntity extends AbstractEntity<BlogCategoryEntity> {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;
}
