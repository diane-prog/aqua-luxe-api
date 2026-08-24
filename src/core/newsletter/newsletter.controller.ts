import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Public, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dtos';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Public()
  @Post('subscribe')
  subscribe(@Body() dto: SubscribeNewsletterDto) { return this.service.subscribe(dto); }

  @Public()
  @Post('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) { return this.service.unsubscribe(email); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin')
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Get('admin/active-count')
  getActiveCount() { return this.service.getActiveCount(); }
}
