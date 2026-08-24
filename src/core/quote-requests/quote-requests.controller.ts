import {
  Controller, Get, Post, Put, Delete, Body, Param, UploadedFile,
  UseGuards, UseInterceptors, ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { QuoteRequestsService } from './quote-requests.service';
import { CreateQuoteRequestDto, UpdateQuoteRequestStatusDto } from './dtos';
import { CloudinaryService } from '../../libs/cloudinary';

@ApiTags('Quote Requests')
@Controller('quote-requests')
export class QuoteRequestsController {
  constructor(
    private readonly service: QuoteRequestsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Post()
  create(@Body() dto: CreateQuoteRequestDto) { return this.service.create(dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin')
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin/pending-count')
  getPendingCount() { return this.service.findPendingCount(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOneById(id); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Put('admin/:id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateQuoteRequestStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Post('admin/:id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async addAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: any,
  ) {
    const result = await this.cloudinaryService.uploadImage(file, 'poolbk/quote-requests');
    return this.service.addAttachment(id, { url: result.secureUrl, publicId: result.publicId });
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
