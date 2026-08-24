import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('project_categories')
export class ProjectCategoryEntity extends AbstractEntity<ProjectCategoryEntity> {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  order: number;
}
