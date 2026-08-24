import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('testimonials')
export class TestimonialEntity extends AbstractEntity<TestimonialEntity> {
  @Column()
  authorName: string;

  @Column({ nullable: true })
  authorAvatar: string;

  @Column({ nullable: true })
  authorAvatarPublicId: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  projectRef: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}
