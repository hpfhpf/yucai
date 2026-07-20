import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CompaniesService } from './companies.service';
import { SearchCompaniesQuery, CreateCompanyDto } from './dto/companies.dto';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: '搜索企业' })
  search(@Query() query: SearchCompaniesQuery) {
    return this.companiesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取企业详情' })
  findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: '创建企业（招聘官/管理员）' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }
}
