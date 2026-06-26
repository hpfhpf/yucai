import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        role: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        idVerifiedAt: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('用户不存在');

    return this.prisma.user.update({
      where: { id: userId },
      data: { nickname: dto.nickname },
      select: {
        id: true,
        phone: true,
        role: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        idVerifiedAt: true,
        createdAt: true,
      },
    });
  }
}
