import {
  Body, Controller, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { RecruiterService } from './recruiter.service';
import {
  RegisterRecruiterDto, UpdateRecruiterDto,
  ListSeekersQuery, ListDeliveriesQuery,
  UpdateDeliveryStatusDto, SendInviteDto,
} from './dto/recruiter.dto';

@ApiTags('recruiter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECRUITER')
@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  // ===== 招聘官档案 =====

  @Post('profile')
  @ApiOperation({ summary: '注册招聘官档案' })
  register(@CurrentUser() user: JwtPayload, @Body() dto: RegisterRecruiterDto) {
    return this.recruiterService.register(user.sub, dto);
  }

  @Get('profile')
  @ApiOperation({ summary: '获取我的招聘官档案' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.recruiterService.getProfile(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新招聘官档案' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateRecruiterDto) {
    return this.recruiterService.updateProfile(user.sub, dto);
  }

  // ===== 简历库 =====

  @Get('seekers')
  @ApiOperation({ summary: '浏览求职者简历库' })
  listSeekers(@Query() query: ListSeekersQuery) {
    return this.recruiterService.listSeekers(query);
  }

  @Get('seekers/:userId')
  @ApiOperation({ summary: '查看求职者完整简历' })
  getSeekerResume(@Param('userId') userId: string) {
    return this.recruiterService.getSeekerResume(userId);
  }

  // ===== 投递管理 =====

  @Get('deliveries')
  @ApiOperation({ summary: '查看收到的投递' })
  listDeliveries(@CurrentUser() user: JwtPayload, @Query() query: ListDeliveriesQuery) {
    return this.recruiterService.listDeliveries(user.sub, query);
  }

  @Put('deliveries/:id/status')
  @ApiOperation({ summary: '更新投递状态（查看/邀请/拒绝/录用）' })
  updateDeliveryStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return this.recruiterService.updateDeliveryStatus(user.sub, id, dto);
  }

  // ===== 面试邀请 =====

  @Post('invite')
  @ApiOperation({ summary: '发送面试邀请' })
  sendInvite(@CurrentUser() user: JwtPayload, @Body() dto: SendInviteDto) {
    return this.recruiterService.sendInvite(user.sub, dto);
  }

  @Get('invites')
  @ApiOperation({ summary: '我发出的邀请列表' })
  listInvites(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.recruiterService.listInvites(user.sub, Number(page) || 1, Number(limit) || 10);
  }
}
