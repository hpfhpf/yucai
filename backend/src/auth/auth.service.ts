import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtPayload } from '../common/types/jwt-payload';

// 固定测试账号（密码明文，快速测试用）
const MOCK_ACCOUNTS = [
  { id: 'mock-seeker-001', phone: '13800000001', password: 'Test1234', role: 'SEEKER', nickname: '测试求职者', idVerified: false },
  { id: 'mock-recruiter-001', phone: '13800000002', password: 'Test1234', role: 'RECRUITER', nickname: '测试招聘官', idVerified: false },
  { id: 'mock-admin-001', phone: '13800000003', password: 'Test1234', role: 'ADMIN', nickname: '测试运营', idVerified: true },
  { id: 'mock-super-001', phone: '13800000004', password: 'Test1234', role: 'SUPER_ADMIN', nickname: '超级管理员', idVerified: true },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(phone: string, password: string) {
    // 1. 先查 mock 账号（明文比对，开发快速登录）
    const mock = MOCK_ACCOUNTS.find((a) => a.phone === phone && a.password === password);
    if (mock) {
      return this.issueToken({
        id: mock.id, phone: mock.phone, role: mock.role,
        nickname: mock.nickname, idVerified: mock.idVerified,
      });
    }

    // 2. fallback：查真实 DB（bcrypt 验证，供 seed 测试用户使用）
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user?.passwordHash) throw new UnauthorizedException('手机号或密码错误');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('手机号或密码错误');

    return this.issueToken({
      id: user.id, phone: user.phone, role: user.role,
      nickname: user.nickname ?? phone, idVerified: !!user.idVerifiedAt,
    });
  }

  private issueToken(account: { id: string; phone: string; role: string; nickname: string; idVerified: boolean }) {
    const payload: JwtPayload = {
      sub: account.id,
      phone: account.phone,
      role: account.role,
      idVerified: account.idVerified,
    };
    return {
      token: this.jwtService.sign(payload),
      user: { id: account.id, phone: account.phone, role: account.role, nickname: account.nickname, idVerified: account.idVerified },
    };
  }

  async getProfile(user: JwtPayload) {
    const mock = MOCK_ACCOUNTS.find((a) => a.id === user.sub);
    if (mock) {
      return { id: mock.id, phone: mock.phone, role: mock.role, nickname: mock.nickname, idVerified: mock.idVerified };
    }
    const dbUser = await this.prisma.user.findUnique({ where: { id: user.sub } });
    if (!dbUser) throw new UnauthorizedException();
    return { id: dbUser.id, phone: dbUser.phone, role: dbUser.role, nickname: dbUser.nickname ?? dbUser.phone, idVerified: !!dbUser.idVerifiedAt };
  }
}
