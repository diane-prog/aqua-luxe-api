import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dtos';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Public()
  @Get()
  get() { return this.service.get(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Put()
  update(@Body() dto: UpdateSettingsDto) { return this.service.update(dto); }
}