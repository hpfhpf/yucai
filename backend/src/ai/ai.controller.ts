import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AiService } from './ai.service';
import { GenerateJobDto } from './dto/generate-job.dto';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-job')
  @Roles('RECRUITER')
  @ApiOperation({ summary: 'AI 生成职位信息（招聘官）' })
  generateJob(@Body() dto: GenerateJobDto) {
    return this.aiService.generateJob(dto.prompt, dto.history);
  }
}
