import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SearchCompaniesQuery, CreateCompanyDto } from './dto/companies.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchCompaniesQuery) {
    const { keyword, limit = 10 } = query;
    const where: any = {};
    if (keyword) where.name = { contains: keyword };

    return this.prisma.company.findMany({
      where,
      take: limit,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, industry: true, scale: true, city: true, isVerified: true, logoUrl: true },
    });
  }

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        industry: true,
        scale: true,
        city: true,
        province: true,
        district: true,
        address: true,
        description: true,
        logoUrl: true,
        cover: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!company) throw new NotFoundException('公司不存在');
    return company;
  }

  async create(dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('同名企业已存在，请直接使用其 ID 注册');

    return this.prisma.company.create({
      data: {
        name: dto.name,
        industry: dto.industry,
        scale: dto.scale,
        city: dto.city,
        province: dto.province,
      },
      select: { id: true, name: true, industry: true, scale: true, city: true, isVerified: true },
    });
  }
}
