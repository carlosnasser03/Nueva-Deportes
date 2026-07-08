import { PrismaClient } from '@prisma/client';
import { ITeamRepository, TeamRecord } from '../interfaces/ITeamRepository';

export class PrismaTeamRepository implements ITeamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(teamId: string): Promise<TeamRecord | null> {
    return this.prisma.team.findUnique({
      where: { id: teamId },
    });
  }

  async findByCategory(categoryId: string): Promise<TeamRecord[]> {
    return this.prisma.team.findMany({
      where: { categoryId },
    });
  }
}
