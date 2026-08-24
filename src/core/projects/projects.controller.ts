import {
  Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UploadedFiles,
  UseGuards, UseInterceptors, ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { CloudinaryService } from '../../libs/cloudinary';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Get()
  findPublished() {
    return this.projectsService.findPublished();
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/all')
  findAll() {
    return this.projectsService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOneById(id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Post('admin')
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Put('admin/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Post('admin/:id/images')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  async addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: any[],
  ) {
    const uploadResults = await this.cloudinaryService.uploadMultiple(files, 'poolbk/projects');
    for (const result of uploadResults) {
      await this.projectsService.addImage(id, { url: result.secureUrl, publicId: result.publicId });
    }
    return this.projectsService.findOneById(id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Post('admin/:id/before-after')
  @UseInterceptors(FilesInterceptor('files', 2))
  @ApiConsumes('multipart/form-data')
  async setBeforeAfter(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: any[],
  ) {
    let beforeImage: { url: string; publicId: string } | undefined;
    let afterImage: { url: string; publicId: string } | undefined;

    if (files[0]) {
      const result = await this.cloudinaryService.uploadImage(files[0], 'poolbk/projects');
      beforeImage = { url: result.secureUrl, publicId: result.publicId };
    }
    if (files[1]) {
      const result = await this.cloudinaryService.uploadImage(files[1], 'poolbk/projects');
      afterImage = { url: result.secureUrl, publicId: result.publicId };
    }

    return this.projectsService.setBeforeAfterImages(id, beforeImage, afterImage);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
