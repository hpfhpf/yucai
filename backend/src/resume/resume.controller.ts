import {
  Body, Controller, Delete, Get, Param, Post, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { ResumeService } from './resume.service';
import {
  UpdateProfileDto, UpdateSelfDescDto,
  CreateEducationDto, UpdateEducationDto,
  CreateWorkExpDto, UpdateWorkExpDto,
  CreateProjectExpDto, UpdateProjectExpDto,
  ConfirmCertDto,
} from './dto/resume.dto';

class RequestCertDto {
  @IsOptional() @IsString() certifierId?: string; // 指定认证人（从推荐列表选定）
}

@ApiTags('resume')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // ===== Profile =====

  @Get('profile')
  @ApiOperation({ summary: '获取求职者基础信息' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getProfile(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新求职者基础信息' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.resumeService.updateProfile(user.sub, dto);
  }

  // ===== Self Desc =====

  @Get('self-desc')
  @ApiOperation({ summary: '获取自我描述' })
  getSelfDesc(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getSelfDesc(user.sub);
  }

  @Put('self-desc')
  @ApiOperation({ summary: '更新自我描述' })
  updateSelfDesc(@CurrentUser() user: JwtPayload, @Body() dto: UpdateSelfDescDto) {
    return this.resumeService.updateSelfDesc(user.sub, dto);
  }

  // ===== Education =====

  @Get('education')
  @ApiOperation({ summary: '获取教育经历列表' })
  getEducations(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getEducations(user.sub);
  }

  @Post('education')
  @ApiOperation({ summary: '新增教育经历' })
  createEducation(@CurrentUser() user: JwtPayload, @Body() dto: CreateEducationDto) {
    return this.resumeService.createEducation(user.sub, dto);
  }

  @Put('education/:id')
  @ApiOperation({ summary: '更新教育经历' })
  updateEducation(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.resumeService.updateEducation(user.sub, id, dto);
  }

  @Delete('education/:id')
  @ApiOperation({ summary: '删除教育经历' })
  deleteEducation(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.resumeService.deleteEducation(user.sub, id);
  }

  // ===== Work Experience =====

  @Get('work-exp')
  @ApiOperation({ summary: '获取工作经历列表' })
  getWorkExps(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getWorkExps(user.sub);
  }

  @Post('work-exp')
  @ApiOperation({ summary: '新增工作经历' })
  createWorkExp(@CurrentUser() user: JwtPayload, @Body() dto: CreateWorkExpDto) {
    return this.resumeService.createWorkExp(user.sub, dto);
  }

  @Put('work-exp/:id')
  @ApiOperation({ summary: '更新工作经历' })
  updateWorkExp(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateWorkExpDto) {
    return this.resumeService.updateWorkExp(user.sub, id, dto);
  }

  @Delete('work-exp/:id')
  @ApiOperation({ summary: '删除工作经历' })
  deleteWorkExp(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.resumeService.deleteWorkExp(user.sub, id);
  }

  // ===== Project Experience =====

  @Get('project-exp')
  @ApiOperation({ summary: '获取项目经历列表' })
  getProjectExps(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getProjectExps(user.sub);
  }

  @Post('project-exp')
  @ApiOperation({ summary: '新增项目经历' })
  createProjectExp(@CurrentUser() user: JwtPayload, @Body() dto: CreateProjectExpDto) {
    return this.resumeService.createProjectExp(user.sub, dto);
  }

  @Put('project-exp/:id')
  @ApiOperation({ summary: '更新项目经历' })
  updateProjectExp(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateProjectExpDto) {
    return this.resumeService.updateProjectExp(user.sub, id, dto);
  }

  @Delete('project-exp/:id')
  @ApiOperation({ summary: '删除项目经历' })
  deleteProjectExp(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.resumeService.deleteProjectExp(user.sub, id);
  }

  // ===== Certification =====

  @Get('work-exp/:id/recommend-certifiers')
  @ApiOperation({ summary: '推荐认证人列表（同公司已认证用户，含隐私熔断）' })
  getRecommendedCertifiers(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.resumeService.getRecommendedCertifiers(user.sub, id);
  }

  @Post('work-exp/:id/request-cert')
  @ApiOperation({ summary: '申请工作认证（生成 shareToken，可选绑定指定认证人）' })
  requestCertification(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: RequestCertDto,
  ) {
    return this.resumeService.requestCertification(user.sub, id, dto.certifierId);
  }

  @Delete('work-exp/:id/cert')
  @ApiOperation({ summary: '取消工作认证申请（仅 PENDING 状态可取消）' })
  cancelCertification(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.resumeService.cancelCertification(user.sub, id);
  }

  @Get('certify/:shareToken')
  @ApiOperation({ summary: '通过 shareToken 获取认证信息预览（认证前展示给认证方）' })
  getCertInfo(@Param('shareToken') shareToken: string) {
    return this.resumeService.getCertInfo(shareToken);
  }

  @Post('certify/:shareToken')
  @ApiOperation({ summary: '确认认证（被邀请方确认）' })
  confirmCertification(
    @CurrentUser() user: JwtPayload,
    @Param('shareToken') shareToken: string,
    @Body() dto: ConfirmCertDto,
  ) {
    return this.resumeService.confirmCertification(user.sub, user.role, shareToken, dto);
  }

  @Get('certifications')
  @ApiOperation({ summary: '获取我的工作认证列表' })
  getCertifications(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getCertifications(user.sub);
  }

  @Get('certifications/given')
  @ApiOperation({ summary: '获取我认证过的记录（推荐记录）' })
  getCertificationsGiven(@CurrentUser() user: JwtPayload) {
    return this.resumeService.getCertificationsGiven(user.sub);
  }
}
