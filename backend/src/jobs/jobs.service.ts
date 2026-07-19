import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, ListJobsQuery, DeliverJobDto } from './dto/jobs.dto';
import { AiService } from '../ai/ai.service';
import {
  DiagnoseStreamEvent,
  JobSummary,
  ResumeSnapshot,
} from '../ai/ai.types';

// CareerLevel 枚举顺序（数值越大越高级，用于 >= 过滤）
const CAREER_LEVEL_ORDER = { IC: 0, LEAD: 1, MGR_DIR: 2, VP_C: 3 };

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ===== 职位列表（求职者浏览）=====

  async list(query: ListJobsQuery, userId?: string) {
    const { page = 1, limit = 10, city, keyword, nature, companyId, enableFilter } = query;
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };
    if (city) where.city = city;
    if (nature) where.nature = nature;
    if (companyId) where.companyId = companyId;
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    // 向上跳槽过滤：仅当 enableFilter=true 且求职者已填写年薪/职级时生效
    if (enableFilter && userId) {
      const profile = await this.prisma.seekerProfile.findUnique({ where: { userId } });
      const filterAnd: any[] = [];

      if (profile?.currentAnnualSalary != null) {
        // 年薪过滤：职位年薪下限 >= 求职者当前年薪；annualSalaryMin=null（AI 未打标）的职位仍展示
        filterAnd.push({
          OR: [
            { annualSalaryMin: null },
            { annualSalaryMin: { gte: profile.currentAnnualSalary } },
          ],
        });
      }

      if (profile?.currentLevel != null) {
        // 职级过滤：职位职级 >= 求职者当前职级；levelTag=null（AI 未打标）的职位仍展示
        const minOrder = CAREER_LEVEL_ORDER[profile.currentLevel as keyof typeof CAREER_LEVEL_ORDER];
        const eligibleLevels = Object.entries(CAREER_LEVEL_ORDER)
          .filter(([, order]) => order >= minOrder)
          .map(([level]) => level);
        filterAnd.push({ OR: [{ levelTag: null }, { levelTag: { in: eligibleLevels } }] });
      }

      if (filterAnd.length) {
        where.AND = [...(where.AND ?? []), ...filterAnd];
      }
    }

    const [total, items] = await Promise.all([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true, logoUrl: true, isVerified: true } },
        },
      }),
    ]);

    return { total, page, limit, items };
  }

  // ===== 职位详情 =====

  async detail(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        recruiter: {
          select: { id: true, realName: true, department: true },
        },
      },
    });
    if (!job) throw new NotFoundException('职位不存在');

    // 浏览量 +1（异步，不阻塞响应）
    this.prisma.job.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return job;
  }

  // ===== 发布职位（招聘官）=====

  async create(userId: string, dto: CreateJobDto) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new ForbiddenException('请先完成招聘官认证');

    const companyId = dto.companyId ?? recruiter.companyId;
    if (!companyId) throw new BadRequestException('未关联企业，无法发布职位');

    return this.prisma.job.create({
      data: {
        recruiterId: recruiter.id,
        companyId,
        title: dto.title,
        nature: dto.nature as any ?? 'FULL_TIME',
        province: dto.province,
        city: dto.city,
        district: dto.district,
        address: dto.address,
        salaryRange: dto.salaryRange,
        annualSalaryMin: dto.annualSalaryMin,
        annualSalaryMax: dto.annualSalaryMax,
        minDegree: dto.minDegree as any ?? 'ANY',
        minExpYears: dto.minExpYears ?? 0,
        description: dto.description,
        perks: dto.perks ?? null,
      },
    });
  }

  // ===== 更新职位（招聘官本人）=====

  async update(userId: string, id: string, dto: UpdateJobDto) {
    const job = await this.findOwnJob(userId, id);
    return this.prisma.job.update({
      where: { id: job.id },
      data: {
        title: dto.title,
        nature: dto.nature as any,
        province: dto.province,
        city: dto.city,
        district: dto.district,
        address: dto.address,
        salaryRange: dto.salaryRange,
        annualSalaryMin: dto.annualSalaryMin,
        annualSalaryMax: dto.annualSalaryMax,
        minDegree: dto.minDegree as any,
        minExpYears: dto.minExpYears,
        description: dto.description,
        perks: dto.perks !== undefined ? dto.perks : undefined,
      },
    });
  }

  // ===== 下架职位（招聘官本人）=====

  async close(userId: string, id: string) {
    const job = await this.findOwnJob(userId, id);
    await this.prisma.job.update({ where: { id: job.id }, data: { status: 'CLOSED' } });
    return { success: true };
  }

  // ===== 投递简历 =====

  async deliver(userId: string, jobId: string, dto: DeliverJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'ACTIVE') throw new NotFoundException('职位不存在或已关闭');

    const existing = await this.prisma.delivery.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (existing) throw new BadRequestException('已投递过该职位');

    // 定向投递：校验定制简历归属与职位一致性
    if (dto.type === 'TARGETED') {
      if (!dto.tailoredResumeId) throw new BadRequestException('缺少定制简历');
      const tr = await this.prisma.tailoredResume.findUnique({
        where: { id: dto.tailoredResumeId },
      });
      if (!tr || tr.userId !== userId || tr.jobId !== jobId) {
        throw new BadRequestException('定制简历无效');
      }
    }

    return this.prisma.delivery.create({
      data: {
        userId,
        jobId,
        creditAuthorized: dto.creditAuthorized,
        type: dto.type === 'TARGETED' ? 'TARGETED' : 'NORMAL',
        tailoredResumeId: dto.type === 'TARGETED' ? dto.tailoredResumeId : null,
      },
    });
  }

  // ===== 我的投递记录 =====
  // type 可选：'NORMAL' | 'TARGETED'，不传返回全部
  async myDeliveries(userId: string, page = 1, limit = 10, type?: 'NORMAL' | 'TARGETED') {
    const skip = (page - 1) * limit;
    const where = { userId, ...(type ? { type } : {}) };
    const [total, items] = await Promise.all([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            include: { company: { select: { id: true, name: true, logoUrl: true } } },
          },
        },
      }),
    ]);
    return { total, page, limit, items };
  }

  // ===== 收藏 / 取消收藏 =====

  async favorite(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('职位不存在');

    await this.prisma.jobFavorite.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { userId, jobId },
      update: {},
    });
    return { success: true };
  }

  async unfavorite(userId: string, jobId: string) {
    await this.prisma.jobFavorite.deleteMany({ where: { userId, jobId } });
    return { success: true };
  }

  // ===== 我的收藏列表 =====

  async myFavorites(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.jobFavorite.count({ where: { userId } }),
      this.prisma.jobFavorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            include: { company: { select: { id: true, name: true, logoUrl: true } } },
          },
        },
      }),
    ]);
    return { total, page, limit, items };
  }

  // ===== 招聘官已发布职位列表 =====

  async myPostedJobs(userId: string, page = 1, limit = 10) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) return { total: 0, page, limit, items: [] };

    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.job.count({ where: { recruiterId: recruiter.id } }),
      this.prisma.job.findMany({
        where: { recruiterId: recruiter.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, page, limit, items };
  }

  // ===== 内部工具 =====

  private async findOwnJob(userId: string, jobId: string) {
    const recruiter = await this.prisma.recruiter.findUnique({ where: { userId } });
    if (!recruiter) throw new ForbiddenException('无权限');

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('职位不存在');
    if (job.recruiterId !== recruiter.id) throw new ForbiddenException('无权操作他人职位');
    return job;
  }

  // ===== AI 诊断 / 定制 =====

  // 聚合当前用户主简历为快照
  private async buildResumeSnapshot(userId: string): Promise<ResumeSnapshot> {
    const profile = await this.prisma.seekerProfile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('请先完善简历');
    const [educations, workExps, projectExps] = await Promise.all([
      this.prisma.education.findMany({ where: { profileId: profile.id }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.workExperience.findMany({ where: { profileId: profile.id }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.projectExperience.findMany({ where: { profileId: profile.id }, orderBy: { sortOrder: 'asc' } }),
    ]);
    return {
      realName: profile.realName || undefined,
      roleTitle: profile.roleTitle || undefined,
      city: profile.city || undefined,
      selfDesc: profile.selfDesc || undefined,
      educations,
      workExps,
      projectExps,
    };
  }

  private async loadJobSummary(jobId: string): Promise<JobSummary> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'ACTIVE') throw new NotFoundException('职位不存在或已关闭');
    return {
      title: job.title,
      salaryRange: job.salaryRange || undefined,
      minDegree: job.minDegree,
      minExpYears: job.minExpYears,
      description: job.description,
      perks: (job.perks as string[]) || undefined,
    };
  }

  // 流式诊断：逐块回调进度，结束落库 ResumeDiagnosis
  async diagnoseStream(
    userId: string,
    jobId: string,
    onEvent: (e: DiagnoseStreamEvent) => void,
  ): Promise<void> {
    const [resume, job] = await Promise.all([
      this.buildResumeSnapshot(userId),
      this.loadJobSummary(jobId),
    ]);
    // 拦截 ai 的 done 事件：先不转发，待落库拿到 id 后补发带 diagnosisId 的 done
    const result = await this.ai.diagnose(resume, job, (e) => {
      if (e.stage === 'done') return;
      onEvent(e);
    });
    const saved = await this.prisma.resumeDiagnosis.create({
      data: {
        userId,
        jobId,
        matchScore: result.matchScore ?? null,
        issues: result.issues as any,
      },
    });
    onEvent({ stage: 'done', percent: 100, result, diagnosisId: saved.id } as any);
  }

  // 生成定制简历草稿并落库
  async tailorResume(userId: string, jobId: string, diagnosisId?: string) {
    const [resume, job] = await Promise.all([
      this.buildResumeSnapshot(userId),
      this.loadJobSummary(jobId),
    ]);
    let issues: unknown;
    if (diagnosisId) {
      const diag = await this.prisma.resumeDiagnosis.findUnique({ where: { id: diagnosisId } });
      if (diag && diag.userId === userId) issues = diag.issues;
    }
    const content = await this.ai.tailor(resume, job, issues);
    return this.prisma.tailoredResume.create({
      data: { userId, jobId, diagnosisId: diagnosisId || null, content: content as any },
    });
  }

  // 保存用户编辑后的定制简历
  async saveTailoredResume(userId: string, id: string, content: Record<string, any>) {
    const tr = await this.prisma.tailoredResume.findUnique({ where: { id } });
    if (!tr) throw new NotFoundException('定制简历不存在');
    if (tr.userId !== userId) throw new ForbiddenException();
    return this.prisma.tailoredResume.update({ where: { id }, data: { content: content as any } });
  }

  // 查看定制简历详情
  async getTailoredResume(userId: string, id: string) {
    const tr = await this.prisma.tailoredResume.findUnique({
      where: { id },
      include: { job: { include: { company: { select: { name: true, logoUrl: true } } } } },
    });
    if (!tr) throw new NotFoundException('定制简历不存在');
    if (tr.userId !== userId) throw new ForbiddenException();
    return tr;
  }
}
