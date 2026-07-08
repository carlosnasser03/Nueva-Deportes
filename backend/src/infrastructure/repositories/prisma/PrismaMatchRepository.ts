import { PrismaClient } from '@prisma/client';
import { IMatchRepository, MatchRecord } from '../interfaces/IMatchRepository';

export class PrismaMatchRepository implements IMatchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByCategory(categoryId: string, status?: string): Promise<MatchRecord[]> {
    const where: any = { categoryId };
    if (status) where.status = status;
    return this.prisma.match.findMany({
      where,
      include: {
        home: true,
        away: true,
      },
    });
  }

  async findById(matchId: string): Promise<MatchRecord | null> {
    return this.prisma.match.findUnique({
      where: { id: matchId },
    });
  }

  async findByIdWithDetails(matchId: string): Promise<MatchRecord | null> {
    return this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        home: true,
        away: true,
        category: true,
      },
    });
  }

  async updateScore(matchId: string, homeGoals: number, awayGoals: number): Promise<void> {
    await this.prisma.match.update({
      where: { id: matchId },
      data: { homeGoals, awayGoals, status: 'finished', updatedAt: new Date() },
    });
  }
}
