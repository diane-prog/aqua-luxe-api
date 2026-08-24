import { Entity, Column, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../../libs/database';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class RoleEntity extends AbstractEntity<RoleEntity> {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => (permission as any).roles, {
    eager: true,
  })
  permissions: PermissionEntity[];
}
