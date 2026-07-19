import {
  Body, Controller, Get, Param, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types/jwt-payload';
import { JobsService } from './jobs.service';
import { SaveTailoredResumeDto } from './dto/jobs.dto';

@ApiTags('tailored-resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tailored-resumes')
export class TailoredResumeController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id')
  @Roles('SEEKER')
  @ApiOperation({ summary: '查看定制简历详情' })
  get(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobsService.getTailoredResume(user.sub, id);
  }

  @Put(':id')
  @Roles('SEEKER')
  @ApiOperation({ summary: '保存定制简历编辑' })
  save(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: SaveTailoredResumeDto,
  ) {
    return this.jobsService.saveTailoredResume(user.sub, id, dto.content || {});
  }
}
