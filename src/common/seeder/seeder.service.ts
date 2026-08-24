import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../core/roles/entities/role.entity';
import { PermissionEntity } from '../../core/permissions/entities/permission.entity';
import { UserEntity } from '../../core/users/entities/user.entity';
import { RoleEnum, PermissionEnum } from '../enum';
import { hashPassword } from '../../helpers';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async seed() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedAdmin();
    this.logger.log('Seeding completed');
  }

  private async seedPermissions() {
    const permissions = Object.values(PermissionEnum);
    for (const perm of permissions) {
      const exists = await this.permissionRepository.findOne({
        where: { name: perm },
      });
      if (!exists) {
        await this.permissionRepository.save(
          this.permissionRepository.create({ name: perm }),
        );
      }
    }
  }

  private async seedRoles() {
    const allPermissions = await this.permissionRepository.find();

    const rolePermissions: Record<RoleEnum, PermissionEnum[]> = {
      [RoleEnum.SUPER_ADMIN]: Object.values(PermissionEnum),
      [RoleEnum.ADMIN]: Object.values(PermissionEnum).filter(
        (p) => p !== PermissionEnum.MANAGE_USERS && p !== PermissionEnum.MANAGE_ROLES,
      ),
      [RoleEnum.EDITOR]: [
        PermissionEnum.MANAGE_BLOG,
        PermissionEnum.MANAGE_PROJECTS,
        PermissionEnum.VIEW_DASHBOARD,
      ],
    };

    for (const roleName of Object.values(RoleEnum)) {
      const exists = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!exists) {
        const role = this.roleRepository.create({
          name: roleName,
          permissions: allPermissions.filter((p) =>
            rolePermissions[roleName].includes(p.name as PermissionEnum),
          ),
        });
        await this.roleRepository.save(role);
      }
    }
  }

  private async seedAdmin() {
    const adminEmail = 'admin@poolbk.com';
    const exists = await this.userRepository.findOne({
      where: { email: adminEmail },
    });
    if (!exists) {
      const superAdminRole = await this.roleRepository.findOne({
        where: { name: RoleEnum.SUPER_ADMIN },
      });
      const hashedPassword = await hashPassword('Admin@123');
      await this.userRepository.save(
        this.userRepository.create({
          email: adminEmail,
          password: hashedPassword,
          fullName: 'Super Admin',
          role: superAdminRole!,
          isActive: true,
        }),
      );
      this.logger.log(`Default admin created: ${adminEmail}`);
    }
  }
}
