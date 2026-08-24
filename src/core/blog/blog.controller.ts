import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dtos';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Public()
  @Get()
  findPublished() { return this.service.findPublished(); }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/all')
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOneById(id); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Post('admin')
  create(@Body() dto: CreateBlogDto) { return this.service.create(dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Put('admin/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBlogDto) { return this.service.update(id, dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
