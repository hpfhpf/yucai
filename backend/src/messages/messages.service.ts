import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getReceivedInvites(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.message.count({ where: { receiverId: userId, type: 'INVITE' } }),
      this.prisma.message.findMany({
        where: { receiverId: userId, type: 'INVITE' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, nickname: true } },
        },
      }),
    ]);

    const jobIds = items.map((m) => m.jobId).filter(Boolean) as string[];
    const jobs = jobIds.length
      ? await this.prisma.job.findMany({
          where: { id: { in: jobIds } },
          include: { company: { select: { name: true } } },
        })
      : [];
    const jobMap = new Map(jobs.map((j) => [j.id, j]));

    const recruiterIds = items.map((m) => m.senderId);
    const recruiters = await this.prisma.recruiter.findMany({
      where: { userId: { in: recruiterIds } },
      select: { userId: true, contactPhone: true },
    });
    const recruiterMap = new Map(recruiters.map((r) => [r.userId, r]));

    return {
      total,
      items: items.map((m) => {
        const job = m.jobId ? jobMap.get(m.jobId) : undefined;
        const recruiter = recruiterMap.get(m.senderId);
        return {
          id: m.id,
          jobId: m.jobId,
          jobTitle: job?.title || '',
          companyName: job?.company?.name || '',
          content: m.content,
          contactPhone: recruiter?.contactPhone || '',
          isRead: m.isRead,
          createdAt: m.createdAt,
        };
      }),
      hasMore: skip + items.length < total,
    };
  }

  async markRead(userId: string, messageId: string) {
    return this.prisma.message.updateMany({
      where: { id: messageId, receiverId: userId },
      data: { isRead: true },
    });
  }
}
