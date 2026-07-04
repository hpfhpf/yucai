import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== 数据看板统计 =====
  async dashboard() {
    const [
      userTotal,
      seekerCount,
      recruiterCount,
      companyTotal,
      companyVerified,
      jobTotal,
      jobActive,
      deliveryTotal,
      certPending,
      idPending,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'SEEKER' } }),
      this.prisma.user.count({ where: { role: 'RECRUITER' } }),
      this.prisma.company.count(),
      this.prisma.company.count({ where: { isVerified: true } }),
      this.prisma.job.count(),
      this.prisma.job.count({ where: { status: 'ACTIVE' } }),
      this.prisma.delivery.count(),
      this.prisma.workCertification.count({ where: { status: 'PENDING' } }),
      this.prisma.identityVerification.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      users: { total: userTotal, seeker: seekerCount, recruiter: recruiterCount },
      companies: { total: companyTotal, verified: companyVerified, unverified: companyTotal - companyVerified },
      jobs: { total: jobTotal, active: jobActive, closed: jobTotal - jobActive },
      deliveries: { total: deliveryTotal },
      pending: { cert: certPending, idVerify: idPending },
    };
  }

  // ===== 用户管理 =====
  async listUsers(query: { page?: number; limit?: number; role?: string; keyword?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { role, keyword } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    // 仅接受合法角色枚举，过滤 "undefined"/"" 等脏值，避免传入 Prisma enum 报错
    const VALID_ROLES = ['SEEKER', 'RECRUITER', 'ADMIN', 'SUPER_ADMIN'];
    if (role && VALID_ROLES.includes(role)) where.role = role;
    if (keyword && keyword !== 'undefined') {
      where.OR = [{ phone: { contains: keyword } }, { nickname: { contains: keyword } }];
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        select: {
          id: true, phone: true, role: true, nickname: true, avatarUrl: true,
          status: true, idVerifiedAt: true, createdAt: true,
        },
      }),
    ]);
    return { total, page, limit, items };
  }

  async setUserStatus(userId: string, status: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('用户不存在');
    if (user.role === 'SUPER_ADMIN') throw new BadRequestException('不可操作超级管理员');
    return this.prisma.user.update({
      where: { id: userId }, data: { status },
      select: { id: true, phone: true, status: true },
    });
  }

  // ===== 企业审核 =====
  async listCompanies(query: { page?: number; limit?: number; verified?: string; keyword?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { verified, keyword } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (verified === 'true') where.isVerified = true;
    if (verified === 'false') where.isVerified = false;
    if (keyword) where.name = { contains: keyword };

    const [total, items] = await Promise.all([
      this.prisma.company.count({ where }),
      this.prisma.company.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { _count: { select: { jobs: true, recruiters: true } } },
      }),
    ]);
    return { total, page, limit, items };
  }

  async verifyCompany(companyId: string, isVerified: boolean, creditScore?: number) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('企业不存在');
    return this.prisma.company.update({
      where: { id: companyId },
      data: { isVerified, ...(creditScore != null ? { creditScore } : {}) },
    });
  }

  // ===== 职位管理 =====
  async listJobs(query: { page?: number; limit?: number; status?: string; keyword?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { status, keyword } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (keyword) where.title = { contains: keyword };

    const [total, items] = await Promise.all([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { name: true, isVerified: true } },
          _count: { select: { deliveries: true } },
        },
      }),
    ]);
    return { total, page, limit, items };
  }

  async setJobStatus(jobId: string, status: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('职位不存在');
    return this.prisma.job.update({
      where: { id: jobId }, data: { status: status as any },
      select: { id: true, title: true, status: true },
    });
  }

  // ===== 实名认证审核 =====
  async listIdVerifications(query: { page?: number; limit?: number; status?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.identityVerification.count({ where }),
      this.prisma.identityVerification.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { phone: true, nickname: true } } },
      }),
    ]);
    return { total, page, limit, items };
  }

  async reviewIdVerification(id: string, status: string, reviewerId: string, rejectReason?: string) {
    const record = await this.prisma.identityVerification.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('认证记录不存在');
    const updated = await this.prisma.identityVerification.update({
      where: { id },
      data: { status: status as any, reviewerId, reviewedAt: new Date(), rejectReason: rejectReason || null },
    });
    if (status === 'APPROVED') {
      await this.prisma.user.update({ where: { id: record.userId }, data: { idVerifiedAt: new Date() } });
    }
    return updated;
  }

  // ===== 超管：管理员账号管理 =====
  async listAdmins() {
    return this.prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, phone: true, role: true, nickname: true, status: true, createdAt: true },
    });
  }

  async setUserRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('用户不存在');
    if (user.role === 'SUPER_ADMIN') throw new BadRequestException('不可变更超级管理员角色');
    return this.prisma.user.update({
      where: { id: userId }, data: { role: role as any },
      select: { id: true, phone: true, role: true },
    });
  }

  // ===== 超管：系统概览（含各角色分布 + 近期活跃）=====
  async systemOverview() {
    const [roleGroups, recentUsers, recentJobs] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.user.findMany({
        take: 5, orderBy: { createdAt: 'desc' },
        select: { id: true, phone: true, role: true, nickname: true, createdAt: true },
      }),
      this.prisma.job.findMany({
        take: 5, orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, createdAt: true, company: { select: { name: true } } },
      }),
    ]);
    return {
      roleDistribution: roleGroups.map((g) => ({ role: g.role, count: g._count._all })),
      recentUsers,
      recentJobs,
    };
  }
}
