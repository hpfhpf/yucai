import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  UpdateProfileDto,
  UpdateSelfDescDto,
  CreateEducationDto,
  UpdateEducationDto,
  CreateWorkExpDto,
  UpdateWorkExpDto,
  CreateProjectExpDto,
  UpdateProjectExpDto,
  ConfirmCertDto,
} from './dto/resume.dto';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取或创建 profile（首次访问自动初始化）
  private async getOrCreateProfile(userId: string) {
    let profile = await this.prisma.seekerProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.seekerProfile.create({ data: { userId } });
    }
    return profile;
  }

  // 校验 profile 归属
  private async ownProfile(profileId: string, userId: string) {
    const profile = await this.prisma.seekerProfile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('简历不存在');
    if (profile.userId !== userId) throw new ForbiddenException();
    return profile;
  }

  // ===== Profile =====

  async getProfile(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true, avatarUrl: true, phone: true },
    });
    return { ...profile, nickname: user?.nickname, avatarUrl: user?.avatarUrl, phone: user?.phone };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.seekerProfile.update({
      where: { id: profile.id },
      data: {
        realName: dto.realName,
        gender: dto.gender as any,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        city: dto.city,
        roleTitle: dto.roleTitle,
        currentAnnualSalary: dto.currentAnnualSalary,
        currentLevel: dto.currentLevel as any,
      },
    });
  }

  // ===== Self Desc =====

  async getSelfDesc(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return { selfDesc: profile.selfDesc };
  }

  async updateSelfDesc(userId: string, dto: UpdateSelfDescDto) {
    const profile = await this.getOrCreateProfile(userId);
    const updated = await this.prisma.seekerProfile.update({
      where: { id: profile.id },
      data: { selfDesc: dto.selfDesc },
    });
    return { selfDesc: updated.selfDesc };
  }

  // ===== Education =====

  async getEducations(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.education.findMany({
      where: { profileId: profile.id },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  async createEducation(userId: string, dto: CreateEducationDto) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.education.create({
      data: {
        profileId: profile.id,
        school: dto.school,
        major: dto.major,
        degree: dto.degree as any,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateEducation(userId: string, id: string, dto: UpdateEducationDto) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('教育经历不存在');
    await this.ownProfile(edu.profileId, userId);
    return this.prisma.education.update({
      where: { id },
      data: {
        school: dto.school,
        major: dto.major,
        degree: dto.degree as any,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteEducation(userId: string, id: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('教育经历不存在');
    await this.ownProfile(edu.profileId, userId);
    await this.prisma.education.delete({ where: { id } });
    return { success: true };
  }

  // ===== Work Experience =====

  async getWorkExps(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.workExperience.findMany({
      where: { profileId: profile.id },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  async createWorkExp(userId: string, dto: CreateWorkExpDto) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.workExperience.create({
      data: {
        profileId: profile.id,
        company: dto.company,
        companyId: dto.companyId,
        title: dto.title,
        city: dto.city,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        skillTags: dto.skillTags ?? null,
        content: dto.content,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateWorkExp(userId: string, id: string, dto: UpdateWorkExpDto) {
    const exp = await this.prisma.workExperience.findUnique({ where: { id }, include: { certification: true } });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);
    if (exp.certification?.status === 'PENDING') {
      throw new BadRequestException('认证申请中的工作经历不可编辑，请先取消认证');
    }
    return this.prisma.workExperience.update({
      where: { id },
      data: {
        company: dto.company,
        companyId: dto.companyId,
        title: dto.title,
        city: dto.city,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        skillTags: dto.skillTags !== undefined ? dto.skillTags : undefined,
        content: dto.content,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteWorkExp(userId: string, id: string) {
    const exp = await this.prisma.workExperience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);
    await this.prisma.workExperience.delete({ where: { id } });
    return { success: true };
  }

  // ===== Project Experience =====

  async getProjectExps(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.projectExperience.findMany({
      where: { profileId: profile.id },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  async createProjectExp(userId: string, dto: CreateProjectExpDto) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.projectExperience.create({
      data: {
        profileId: profile.id,
        name: dto.name,
        role: dto.role,
        techTags: dto.techTags ?? null,
        content: dto.content,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateProjectExp(userId: string, id: string, dto: UpdateProjectExpDto) {
    const exp = await this.prisma.projectExperience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('项目经历不存在');
    await this.ownProfile(exp.profileId, userId);
    return this.prisma.projectExperience.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
        techTags: dto.techTags !== undefined ? dto.techTags : undefined,
        content: dto.content,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteProjectExp(userId: string, id: string) {
    const exp = await this.prisma.projectExperience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('项目经历不存在');
    await this.ownProfile(exp.profileId, userId);
    await this.prisma.projectExperience.delete({ where: { id } });
    return { success: true };
  }

  // ===== Work Certification =====

  async requestCertification(userId: string, workExpId: string, certifierId?: string) {
    const exp = await this.prisma.workExperience.findUnique({
      where: { id: workExpId },
      include: { certification: true },
    });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);

    if (exp.certification?.status === 'APPROVED') {
      return { id: exp.certification.id, status: 'APPROVED', company: exp.company, shareToken: null };
    }

    // 若指定了认证人，预校验其在同公司有 APPROVED 记录
    if (certifierId) {
      if (certifierId === userId) throw new BadRequestException('不能选择自己作为认证人');
      if (exp.companyId) {
        const certifierApproved = await this.prisma.workCertification.findFirst({
          where: { userId: certifierId, status: 'APPROVED', workExp: { companyId: exp.companyId } },
        });
        if (!certifierApproved) throw new BadRequestException('所选认证人在该公司无有效认证记录');
      }
    }

    const shareToken = randomBytes(24).toString('hex');
    const shareExpireAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72h

    const cert = await this.prisma.workCertification.upsert({
      where: { workExpId },
      create: {
        userId, workExpId, certifierType: 'PEER', status: 'PENDING',
        certifierId: certifierId ?? null,
        shareToken, shareExpireAt,
      },
      update: {
        status: 'PENDING',
        certifierId: certifierId ?? null,
        shareToken, shareExpireAt,
      },
    });
    return { id: cert.id, status: cert.status, company: exp.company, shareToken: cert.shareToken, shareExpireAt: cert.shareExpireAt };
  }

  async getCertInfo(shareToken: string) {
    const cert = await this.prisma.workCertification.findUnique({
      where: { shareToken },
      include: {
        workExp: { select: { company: true, title: true, startDate: true, endDate: true } },
        user: { select: { seekerProfile: { select: { realName: true } } } },
      },
    });
    if (!cert) throw new NotFoundException('认证链接不存在或已失效');
    if (cert.status === 'APPROVED') throw new BadRequestException('该工作经历已认证');
    if (cert.shareExpireAt && cert.shareExpireAt < new Date()) throw new BadRequestException('认证链接已过期');
    return {
      company: cert.workExp.company,
      jobTitle: cert.workExp.title,
      startDate: cert.workExp.startDate,
      endDate: cert.workExp.endDate,
      certifieeRealName: cert.user.seekerProfile?.realName || null,
    };
  }

  async confirmCertification(certifierId: string, certifierRole: string, shareToken: string, dto: ConfirmCertDto) {
    const cert = await this.prisma.workCertification.findUnique({
      where: { shareToken },
      include: { workExp: true },
    });
    if (!cert) throw new NotFoundException('认证链接不存在或已失效');
    if (cert.status === 'APPROVED') throw new BadRequestException('该工作经历已认证');
    if (cert.shareExpireAt && cert.shareExpireAt < new Date()) throw new BadRequestException('认证链接已过期（72小时有效期）');
    if (cert.userId === certifierId) throw new BadRequestException('不能认证自己的工作经历');

    // 若认证链接已绑定指定认证人，当前登录人必须匹配
    if (cert.certifierId && cert.certifierId !== certifierId) {
      throw new ForbiddenException('此认证链接非发给您的，无法操作');
    }

    if (certifierRole !== 'SUPER_ADMIN') {
      const targetExp = cert.workExp;
      if (!targetExp.companyId) {
        throw new ForbiddenException('该工作经历未关联注册公司，仅超级管理员可直接认证');
      }
      const certifierApproved = await this.prisma.workCertification.findFirst({
        where: {
          userId: certifierId,
          status: 'APPROVED',
          workExp: { companyId: targetExp.companyId },
        },
      });
      if (!certifierApproved) {
        throw new ForbiddenException('您在该公司的工作经历尚未通过认证，无法为他人认证');
      }
    }

    await this.prisma.workCertification.update({
      where: { id: cert.id },
      data: {
        status: 'APPROVED',
        certifierId,
        certifierType: certifierRole === 'SUPER_ADMIN' ? 'ADMIN' : 'PEER',
        relationship: dto.relationship,
        recommendation: dto.recommendation,
        anonymous: dto.anonymous ?? false,
        knowFrom: dto.knowFrom ? new Date(dto.knowFrom) : null,
        knowTo: dto.knowTo ? new Date(dto.knowTo) : null,
        shareToken: null,
        shareExpireAt: null,
      },
    });
    return { success: true, company: cert.workExp.company };
  }

  async getCertificationsGiven(userId: string) {
    const certs = await this.prisma.workCertification.findMany({
      where: { certifierId: userId, status: { in: ['PENDING', 'APPROVED'] } },
      include: {
        workExp: { select: { company: true, title: true, startDate: true, endDate: true } },
        user: { select: { seekerProfile: { select: { realName: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return certs.map((c) => ({
      id: c.id,
      status: c.status,
      shareToken: c.shareToken,
      certifiedAt: c.status === 'APPROVED' ? c.updatedAt : null,
      certifieeRealName: c.user.seekerProfile?.realName || null,
      anonymous: c.anonymous,
      company: c.workExp.company,
      jobTitle: c.workExp.title,
      workStartDate: c.workExp.startDate,
      workEndDate: c.workExp.endDate,
      relationship: c.relationship,
      recommendation: c.recommendation,
    }));
  }

  async cancelCertification(userId: string, workExpId: string) {
    const exp = await this.prisma.workExperience.findUnique({ where: { id: workExpId }, include: { certification: true } });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);
    if (!exp.certification) return { success: true };
    if (exp.certification.status === 'APPROVED') throw new BadRequestException('已认证的工作经历不能取消认证');
    await this.prisma.workCertification.delete({ where: { workExpId } });
    return { success: true };
  }

  async getCertifications(userId: string) {
    const certs = await this.prisma.workCertification.findMany({
      where: { userId },
      include: {
        workExp: { select: { company: true, title: true, companyId: true } },
        certifier: {
          select: {
            nickname: true,
            seekerProfile: { select: { realName: true, roleTitle: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return certs.map((c) => ({
      id: c.id,
      workExpId: c.workExpId,
      company: c.workExp.company,
      jobTitle: c.workExp.title,
      status: c.status,
      certifierType: c.certifierType,
      shareToken: c.shareToken,
      shareExpireAt: c.shareExpireAt,
      createdAt: c.createdAt,
      // 仅 APPROVED 时有意义
      certifierName: c.certifier?.seekerProfile?.realName ?? c.certifier?.nickname ?? null,
      certifierRole: c.certifier?.seekerProfile?.roleTitle ?? null,
      relationship: c.relationship,
      recommendation: c.recommendation,
      knowFrom: c.knowFrom,
      knowTo: c.knowTo,
      certifiedAt: c.status === 'APPROVED' ? c.updatedAt : null,
    }));
  }

  // ===== 推荐认证人 =====

  // CareerLevel 排序权重（越大越优先）
  private readonly LEVEL_ORDER: Record<string, number> = { VP_C: 3, MGR_DIR: 2, LEAD: 1, IC: 0 };

  async getRecommendedCertifiers(userId: string, workExpId: string) {
    // 1. 获取目标工作经历
    const exp = await this.prisma.workExperience.findUnique({
      where: { id: workExpId },
      include: { profile: true },
    });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);

    if (!exp.companyId) return []; // 未关联注册公司，无法推荐

    // 2. 隐私熔断：找出求职者的「当前在职」公司（endDate 为空）
    const seekerWorkExps = await this.prisma.workExperience.findMany({
      where: { profileId: exp.profileId, endDate: null, companyId: { not: null } },
      select: { companyId: true },
    });
    const currentCompanyIds = new Set(seekerWorkExps.map((e) => e.companyId as string));

    // 3. 查找同公司有 APPROVED 认证的其他用户，且在职时间有重叠
    const now = new Date();
    const expStart = exp.startDate ?? new Date(0);
    const expEnd = exp.endDate ?? now;

    const certifications = await this.prisma.workCertification.findMany({
      where: {
        status: 'APPROVED',
        userId: { not: userId },
        workExp: {
          companyId: exp.companyId,
          // 时间重叠：候选人 startDate <= exp 结束 AND (候选人 endDate >= exp 开始 OR 候选人仍在职)
          startDate: { lte: expEnd },
          OR: [
            { endDate: { gte: expStart } },
            { endDate: null },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            seekerProfile: {
              select: { realName: true, roleTitle: true, currentLevel: true },
            },
          },
        },
        workExp: {
          select: { company: true, title: true, startDate: true, endDate: true, companyId: true },
        },
      },
    });

    // 4. 应用隐私熔断，同时过滤掉认证人自己在现任公司注册的记录（避免暴露）
    const filtered = certifications.filter((cert) => {
      const certCompanyId = cert.workExp.companyId;
      if (certCompanyId && currentCompanyIds.has(certCompanyId)) return false;
      return true;
    });

    // 5. 按 userId 去重（同一人可能在同公司有多条认证）
    const seen = new Set<string>();
    const unique = filtered.filter((cert) => {
      if (seen.has(cert.userId)) return false;
      seen.add(cert.userId);
      return true;
    });

    // 6. 按 CareerLevel 降序排列，未填职级排末位
    unique.sort((a, b) => {
      const la = this.LEVEL_ORDER[a.user.seekerProfile?.currentLevel ?? ''] ?? -1;
      const lb = this.LEVEL_ORDER[b.user.seekerProfile?.currentLevel ?? ''] ?? -1;
      return lb - la;
    });

    // 7. 格式化返回（不脱敏）
    return unique.map((cert) => ({
      userId: cert.userId,
      nickname: cert.user.nickname,
      realName: cert.user.seekerProfile?.realName ?? null,
      avatarUrl: cert.user.avatarUrl ?? null,
      roleTitle: cert.user.seekerProfile?.roleTitle ?? null,
      currentLevel: cert.user.seekerProfile?.currentLevel ?? null,
      company: cert.workExp.company,
      workTitle: cert.workExp.title,
      workStartDate: cert.workExp.startDate,
      workEndDate: cert.workExp.endDate,
    }));
  }
}
