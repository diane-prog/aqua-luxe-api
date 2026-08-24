import {
  Controller, Get, Post, Put, Delete, Body, Param,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dtos';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Get()
  findActive() {
    return this.servicesService.findActive();
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/all')
  findAll() {
    return this.servicesService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOneById(id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Post('admin')
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Put('admin/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}
