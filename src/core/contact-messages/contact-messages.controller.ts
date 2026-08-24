import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto, UpdateContactMessageStatusDto } from './dtos';

@ApiTags('Contact Messages')
@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private readonly service: ContactMessagesService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateContactMessageDto) { return this.service.create(dto); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin')
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin/unread-count')
  getUnreadCount() { return this.service.findUnreadCount(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOneById(id); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Put('admin/:id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactMessageStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Delete('admin/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
