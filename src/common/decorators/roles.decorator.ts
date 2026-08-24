import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enum';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: RoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
