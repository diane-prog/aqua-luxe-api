import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dtos';

@ApiTags('Blog Categories')
@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly service: BlogCategoriesService) {}

  @Public()
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOneById(id); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Post('admin')
  create(@Body() dto: CreateBlogCategoryDto) { return this.service.create(dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Put('admin/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBlogCategoryDto) { return this.service.update(id, dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
