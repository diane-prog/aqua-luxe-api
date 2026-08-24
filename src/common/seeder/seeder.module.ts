import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../core/roles/entities/role.entity';
import { PermissionEntity } from '../../core/permissions/entities/permission.entity';
import { UserEntity } from '../../core/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
