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

  async requestCertification(userId: string, workExpId: string) {
    const exp = await this.prisma.workExperience.findUnique({
      where: { id: workExpId },
      include: { certification: true },
    });
    if (!exp) throw new NotFoundException('工作经历不存在');
    await this.ownProfile(exp.profileId, userId);

    if (exp.certification?.status === 'APPROVED') {
      return { id: exp.certification.id, status: 'APPROVED', company: exp.company, shareToken: null };
    }

    const shareToken = randomBytes(24).toString('hex');
    const shareExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cert = await this.prisma.workCertification.upsert({
      where: { workExpId },
      create: { userId, workExpId, certifierType: 'PEER', status: 'PENDING', shareToken, shareExpireAt },
      update: { status: 'PENDING', shareToken, shareExpireAt },
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
    if (cert.shareExpireAt && cert.shareExpireAt < new Date()) throw new BadRequestException('认证链接已过期');
    if (cert.userId === certifierId) throw new BadRequestException('不能认证自己的工作经历');

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
      where: { certifierId: userId, status: 'APPROVED' },
      include: {
        workExp: { select: { company: true, title: true, startDate: true, endDate: true } },
        user: { select: { seekerProfile: { select: { realName: true } } }, },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return certs.map((c) => ({
      id: c.id,
      certifiedAt: c.updatedAt,
      certifieeRealName: c.user.seekerProfile?.realName || null,
      anonymous: c.anonymous,
      company: c.workExp.company,
      jobTitle: c.workExp.title,
      workStartDate: c.workExp.startDate,
      workEndDate: c.workExp.endDate,
      relationship: c.relationship,
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
      include: { workExp: { select: { company: true, title: true, companyId: true } } },
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
    }));
  }
}
