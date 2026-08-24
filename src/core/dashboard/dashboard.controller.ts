import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RequireRoles } from '../../common';
import { RoleEnum } from '../../common/enum';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.EDITOR)
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('quotes-by-month')
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getQuoteRequestsByMonth() {
    return this.dashboardService.getQuoteRequestsByMonth();
  }

  @Get('top-services')
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getTopServices() {
    return this.dashboardService.getTopServices();
  }

  @Get('recent-quotes')
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRecentQuotes(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentQuotes(limit);
  }

  @Get('recent-messages')
  @RequireRoles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRecentMessages(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentMessages(limit);
  }
}
