import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { PackagePeriodEnum } from '../../../common/enum';

@Entity('packages')
export class PackageEntity extends AbstractEntity<PackageEntity> {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: PackagePeriodEnum, default: PackagePeriodEnum.MONTHLY })
  period: PackagePeriodEnum;

  @Column('simple-array', { nullable: true })
  features: string[];

  @Column({ default: false })
  isHighlighted: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;
}
