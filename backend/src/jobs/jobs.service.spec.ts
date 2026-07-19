import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JobsService } from './jobs.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('JobsService', () => {
  let service: JobsService;
  let mockPrisma: any;

  beforeEach(() => {
    // 创建 PrismaService 的 mock 对象
    mockPrisma = {
      job: {
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      recruiter: {
        findUnique: vi.fn(),
      },
      delivery: {
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      jobFavorite: {
        count: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn(),
        deleteMany: vi.fn(),
      },
    };

    // AiService mock（诊断/定制方法在本测试文件中不涉及）
    const mockAi = { diagnose: vi.fn(), tailor: vi.fn() };

    // 直接注入 mock，绕开 NestJS 的 TestingModule
    service = new JobsService(mockPrisma as PrismaService, mockAi as any);
  });

  describe('list', () => {
    it('无关键词时应该正常返回职位列表', async () => {
      const mockJobs = [
        { id: '1', title: '前端工程师', city: '北京' },
        { id: '2', title: '后端工程师', city: '上海' },
      ];

      mockPrisma.job.count.mockResolvedValue(2);
      mockPrisma.job.findMany.mockResolvedValue(mockJobs);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        items: mockJobs,
      });

      // 验证 count 调用的 where 条件
      expect(mockPrisma.job.count).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
      });
    });

    it('有关键词时应该模糊搜索 title 和 description', async () => {
      mockPrisma.job.count.mockResolvedValue(1);
      mockPrisma.job.findMany.mockResolvedValue([{ id: '1', title: 'Java开发' }]);

      await service.list({ keyword: 'Java', page: 1, limit: 10 });

      // 验证 where 条件包含 OR 子句
      expect(mockPrisma.job.count).toHaveBeenCalledWith({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: 'Java' } },
            { description: { contains: 'Java' } },
          ],
        },
      });
    });

    it('应该正确处理 nature 筛选', async () => {
      mockPrisma.job.count.mockResolvedValue(0);
      mockPrisma.job.findMany.mockResolvedValue([]);

      await service.list({ nature: 'FULL_TIME' as any, page: 1, limit: 10 });

      expect(mockPrisma.job.count).toHaveBeenCalledWith({
        where: { status: 'ACTIVE', nature: 'FULL_TIME' },
      });
    });

    it('应该正确计算分页 skip 值', async () => {
      mockPrisma.job.count.mockResolvedValue(50);
      mockPrisma.job.findMany.mockResolvedValue([]);

      await service.list({ page: 3, limit: 10 });

      expect(mockPrisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (3 - 1) * 10
          take: 10,
        })
      );
    });

    it('应该返回包含公司信息的结果', async () => {
      mockPrisma.job.count.mockResolvedValue(1);
      mockPrisma.job.findMany.mockResolvedValue([
        {
          id: '1',
          title: 'Python工程师',
          company: { id: 'c1', name: '字节跳动', logoUrl: '', isVerified: true },
        },
      ]);

      const result = await service.list({ page: 1, limit: 10 });

      expect(result.items[0]).toHaveProperty('company');
      expect(result.items[0].company.name).toBe('字节跳动');
    });
  });
});
