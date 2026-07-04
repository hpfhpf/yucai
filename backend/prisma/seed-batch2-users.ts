import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 第二批基础用户：与原始 seed.ts 结构一致，4 个角色各一，使用新手机号与新 id 避免唯一约束冲突
async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  const mockUsers = [
    { id: 'mock-seeker-b2-001', phone: '13800000101', role: 'SEEKER' as const, nickname: '测试求职者B2' },
    { id: 'mock-recruiter-b2-001', phone: '13800000102', role: 'RECRUITER' as const, nickname: '测试招聘官B2' },
    { id: 'mock-admin-b2-001', phone: '13800000103', role: 'ADMIN' as const, nickname: '测试运营B2', idVerifiedAt: new Date() },
    { id: 'mock-super-b2-001', phone: '13800000104', role: 'SUPER_ADMIN' as const, nickname: '超级管理员B2', idVerifiedAt: new Date() },
  ];

  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { phone: u.phone },
      update: { nickname: u.nickname },
      create: {
        id: u.id,
        phone: u.phone,
        passwordHash: hash,
        role: u.role,
        nickname: u.nickname,
        idVerifiedAt: u.idVerifiedAt ?? null,
      },
    });
  }

  console.log('✅ Batch2 mock users seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
