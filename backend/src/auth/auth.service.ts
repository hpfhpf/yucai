import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/types/jwt-payload';

// 测试账号，替换真实 auth 后删除
const MOCK_ACCOUNTS = [
  {
    id: 'mock-seeker-001',
    phone: '13800000001',
    password: 'Test1234',
    role: 'SEEKER',
    nickname: '测试求职者',
    idVerified: false,
  },
  {
    id: 'mock-recruiter-001',
    phone: '13800000002',
    password: 'Test1234',
    role: 'RECRUITER',
    nickname: '测试招聘官',
    idVerified: false,
  },
  {
    id: 'mock-admin-001',
    phone: '13800000003',
    password: 'Test1234',
    role: 'ADMIN',
    nickname: '测试运营',
    idVerified: true,
  },
  {
    id: 'mock-super-001',
    phone: '13800000004',
    password: 'Test1234',
    role: 'SUPER_ADMIN',
    nickname: '超级管理员',
    idVerified: true,
  },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(phone: string, password: string) {
    const account = MOCK_ACCOUNTS.find(
      (a) => a.phone === phone && a.password === password,
    );
    if (!account) throw new UnauthorizedException('手机号或密码错误');

    const payload: JwtPayload = {
      sub: account.id,
      phone: account.phone,
      role: account.role,
      idVerified: account.idVerified,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: account.id,
        phone: account.phone,
        role: account.role,
        nickname: account.nickname,
        idVerified: account.idVerified,
      },
    };
  }

  getProfile(user: JwtPayload) {
    const account = MOCK_ACCOUNTS.find((a) => a.id === user.sub);
    if (!account) throw new UnauthorizedException();
    return {
      id: account.id,
      phone: account.phone,
      role: account.role,
      nickname: account.nickname,
      idVerified: account.idVerified,
    };
  }
}
