import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('team')
export class TeamEntity extends AbstractEntity<TeamEntity> {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  photoPublicId: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column('simple-json', { nullable: true })
  socialLinks: { platform: string; url: string }[];

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}