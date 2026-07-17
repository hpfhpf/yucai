import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, ListJobsQuery, DeliverJobDto } from './dto/jobs.dto';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // ===== 公开浏览（登录即可）=====

  @Get()
  @ApiOperation({ summary: '职位列表（分页+筛选）' })
  list(@Query() query: ListJobsQuery, @CurrentUser() user: JwtPayload) {
    return this.jobsService.list(query, user?.sub);
  }

  @Get('my-deliveries')
  @Roles('SEEKER')
  @ApiOperation({ summary: '我的投递记录' })
  myDeliveries(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.jobsService.myDeliveries(user.sub, Number(page) || 1, Number(limit) || 10);
  }

  @Get('my-favorites')
  @Roles('SEEKER')
  @ApiOperation({ summary: '我的收藏' })
  myFavorites(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.jobsService.myFavorites(user.sub, Number(page) || 1, Number(limit) || 10);
  }

  @Get('my-posted')
  @Roles('RECRUITER')
  @ApiOperation({ summary: '我发布的职位' })
  myPosted(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.jobsService.myPostedJobs(user.sub, Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: '职位详情' })
  detail(@Param('id') id: string) {
    return this.jobsService.detail(id);
  }

  // ===== 招聘官操作 =====

  @Post()
  @Roles('RECRUITER')
  @ApiOperation({ summary: '发布职位（招聘官）' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user.sub, dto);
  }

  @Put(':id')
  @Roles('RECRUITER')
  @ApiOperation({ summary: '更新职位（招聘官）' })
  update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @Roles('RECRUITER')
  @ApiOperation({ summary: '下架职位（招聘官）' })
  close(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobsService.close(user.sub, id);
  }

  // ===== 求职者操作 =====

  @Post(':id/deliver')
  @Roles('SEEKER')
  @ApiOperation({ summary: '投递简历' })
  deliver(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: DeliverJobDto) {
    return this.jobsService.deliver(user.sub, id, dto);
  }

  @Post(':id/favorite')
  @Roles('SEEKER')
  @ApiOperation({ summary: '收藏职位' })
  favorite(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobsService.favorite(user.sub, id);
  }

  @Delete(':id/favorite')
  @Roles('SEEKER')
  @ApiOperation({ summary: '取消收藏' })
  unfavorite(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobsService.unfavorite(user.sub, id);
  }
}
