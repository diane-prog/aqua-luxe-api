import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';

@Entity('settings')
export class SettingsEntity extends AbstractEntity<SettingsEntity> {
  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  logoPublicId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  businessHours: string;

  @Column('simple-json', { nullable: true })
  socialLinks: { platform: string; url: string }[];

  @Column({ nullable: true })
  footerText: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;
}