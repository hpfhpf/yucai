import {
  Body, Controller, Get, Param, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===== 数据看板（运营 + 超管）=====
  @Get('dashboard')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '数据看板统计' })
  dashboard() {
    return this.adminService.dashboard();
  }

  // ===== 用户管理 =====
  @Get('users')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '用户列表' })
  listUsers(@Query() query: any) {
    return this.adminService.listUsers(query);
  }

  @Put('users/:id/status')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '启用/禁用用户' })
  setUserStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.adminService.setUserStatus(id, Number(status));
  }

  // ===== 企业审核 =====
  @Get('companies')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '企业列表' })
  listCompanies(@Query() query: any) {
    return this.adminService.listCompanies(query);
  }

  @Put('companies/:id/verify')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '企业认证审核' })
  verifyCompany(@Param('id') id: string, @Body() body: { isVerified: boolean; creditScore?: number }) {
    return this.adminService.verifyCompany(id, body.isVerified, body.creditScore);
  }

  // ===== 职位管理 =====
  @Get('jobs')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '职位列表' })
  listJobs(@Query() query: any) {
    return this.adminService.listJobs(query);
  }

  @Put('jobs/:id/status')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '上架/下架职位' })
  setJobStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.setJobStatus(id, status);
  }

  // ===== 实名认证审核 =====
  @Get('id-verifications')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '实名认证审核列表' })
  listIdVerifications(@Query() query: any) {
    return this.adminService.listIdVerifications(query);
  }

  @Put('id-verifications/:id/review')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '审核实名认证' })
  reviewIdVerification(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: { status: string; rejectReason?: string },
  ) {
    return this.adminService.reviewIdVerification(id, body.status, user.sub, body.rejectReason);
  }

  // ===== 超管专属 =====
  @Get('system/overview')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: '系统总览（超管）' })
  systemOverview() {
    return this.adminService.systemOverview();
  }

  @Get('admins')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: '管理员账号列表（超管）' })
  listAdmins() {
    return this.adminService.listAdmins();
  }

  @Put('users/:id/role')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: '变更用户角色（超管）' })
  setUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.setUserRole(id, role);
  }
}
