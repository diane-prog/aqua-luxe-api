import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dtos';

@ApiTags('Roles')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOneById(id);
  }

  @Post()
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @RequireRoles(RoleEnum.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
