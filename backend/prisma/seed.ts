import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  const mockUsers = [
    { id: 'mock-seeker-001', phone: '13800000001', role: 'SEEKER' as const, nickname: '测试求职者' },
    { id: 'mock-recruiter-001', phone: '13800000002', role: 'RECRUITER' as const, nickname: '测试招聘官' },
    { id: 'mock-admin-001', phone: '13800000003', role: 'ADMIN' as const, nickname: '测试运营', idVerifiedAt: new Date() },
    { id: 'mock-super-001', phone: '13800000004', role: 'SUPER_ADMIN' as const, nickname: '超级管理员', idVerifiedAt: new Date() },
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

  console.log('✅ Mock users seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
