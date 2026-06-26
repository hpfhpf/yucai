import {
  BadRequestException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  RegisterRecruiterDto, UpdateRecruiterDto,
  ListSeekersQuery, ListDeliveriesQuery,
  UpdateDeliveryStatusDto, SendInviteDto,
} from './dto/recruiter.dto';

@Injectable()
export class RecruiterService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== 招聘官档案 =====

  async register(userId: string, dto: RegisterRecruiterDto) {
    const existing = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException('已注册过招聘官档案，请使用更新接口');

    if (dto.companyId) {
      const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
      if (!company) throw new NotFoundException('企业不存在，请先创建或搜索企业');
    }

    return this.prisma.recruiter.create({
      data: {
        userId,
        companyId: dto.companyId ?? null,
        realName: dto.realName,
        department: dto.department,
        contactPhone: dto.contactPhone,
      },
      include: { company: { select: { id: true, name: true, isVerified: true } } },
    });
  }

  async getProfile(userId: string) {
    const recruiter = await this.prisma.recruiter.findUnique({
      where: { userId },
      include: { company: { select: { id: true, name: true, logoUrl: true, isVerified: true } } },
    });
    if (!recruiter) throw new NotFoundException('未注册招聘官档案');
    return recruiter;
  }

  async updateProfile(userId: string, dto: UpdateRecruiterDto) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new NotFoundException('未注册招聘官档案');

    return this.prisma.recruiter.update({
      where: { userId },
      data: {
        realName: dto.realName,
        department: dto.department,
        contactPhone: dto.contactPhone,
      },
      include: { company: { select: { id: true, name: true, isVerified: true } } },
    });
  }

  // ===== 简历库 =====

  async listSeekers(query: ListSeekersQuery) {
    const { page = 1, limit = 10, city, keyword } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (city) where.city = city;
    if (keyword) {
      where.OR = [
        { realName: { contains: keyword } },
        { roleTitle: { contains: keyword } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.seekerProfile.count({ where }),
      this.prisma.seekerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          userId: true,
          realName: true,
          gender: true,
          city: true,
          roleTitle: true,
          updatedAt: true,
          user: { select: { nickname: true, avatarUrl: true } },
          educations: { select: { school: true, degree: true }, orderBy: { startDate: 'desc' }, take: 1 },
          workExps: { select: { company: true, title: true }, orderBy: { startDate: 'desc' }, take: 1 },
        },
      }),
    ]);

    return { total, page, limit, items };
  }

  async getSeekerResume(userId: string) {
    const profile = await this.prisma.seekerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { nickname: true, avatarUrl: true, idVerifiedAt: true } },
        educations: { orderBy: { startDate: 'desc' } },
        workExps: { orderBy: { startDate: 'desc' } },
        projectExps: { orderBy: { startDate: 'desc' } },
      },
    });
    if (!profile) throw new NotFoundException('该用户未完善简历');
    return profile;
  }

  // ===== 投递管理 =====

  async listDeliveries(userId: string, query: ListDeliveriesQuery) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new ForbiddenException('未注册招聘官档案');

    const { page = 1, limit = 10, jobId, status } = query;
    const skip = (page - 1) * limit;

    // 只能看自己职位收到的投递
    const myJobIds = await this.prisma.job
      .findMany({ where: { recruiterId: recruiter.id }, select: { id: true } })
      .then(jobs => jobs.map(j => j.id));

    const where: any = { jobId: { in: myJobIds } };
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: { select: { id: true, title: true } },
          user: {
            select: {
              id: true, nickname: true, avatarUrl: true,
              seekerProfile: { select: { realName: true, city: true, roleTitle: true } },
            },
          },
        },
      }),
    ]);

    return { total, page, limit, items };
  }

  async updateDeliveryStatus(userId: string, deliveryId: string, dto: UpdateDeliveryStatusDto) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new ForbiddenException('未注册招聘官档案');

    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { job: true },
    });
    if (!delivery) throw new NotFoundException('投递记录不存在');
    if (delivery.job.recruiterId !== recruiter.id) throw new ForbiddenException('无权操作此投递');

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: { status: dto.status as any },
    });
  }

  // ===== 面试邀请 =====

  async sendInvite(userId: string, dto: SendInviteDto) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new ForbiddenException('未注册招聘官档案');

    const seeker = await this.prisma.user.findUnique({ where: { id: dto.seekerUserId } });
    if (!seeker) throw new NotFoundException('求职者不存在');

    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('职位不存在');
    if (job.recruiterId !== recruiter.id) throw new ForbiddenException('只能用自己的职位发送邀请');

    return this.prisma.message.create({
      data: {
        type: 'INVITE',
        senderId: userId,
        receiverId: dto.seekerUserId,
        jobId: dto.jobId,
        content: dto.content,
      },
    });
  }

  async listInvites(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.message.count({ where: { senderId: userId, type: 'INVITE' } }),
      this.prisma.message.findMany({
        where: { senderId: userId, type: 'INVITE' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          receiver: { select: { id: true, nickname: true, avatarUrl: true } },
          // job 字段通过 jobId 手动关联，Message 没有直接 include job
        },
      }),
    ]);
    return { total, page, limit, items };
  }
}
