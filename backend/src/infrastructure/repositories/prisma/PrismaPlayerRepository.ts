import { PrismaClient } from '@prisma/client';
import { IPlayerRepository, PlayerRecord, PlayerMatchStatPayload } from '../interfaces/IPlayerRepository';

export class PrismaPlayerRepository implements IPlayerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByCategory(categoryId: string): Promise<PlayerRecord[]> {
    const players = await this.prisma.player.findMany({
      where: { categoryId },
      include: {
        stats: { include: { match: true } },
      },
    });
    return players.map((player: any) => {
      const stats = player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      }));
      const totalGoals = player.stats.reduce((sum: number, stat: any) => sum + (stat.goals || 0), 0);
      return {
        ...player,
        goals: totalGoals,
        stats,
      };
    });
  }

  async findById(playerId: string): Promise<PlayerRecord | null> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: { include: { match: true } },
      },
    });
    if (!player) return null;
    const stats = player.stats.map((stat: any) => ({
      matchId: stat.matchId,
      match: { id: stat.match.id, date: stat.match.date },
      minutesPlayed: stat.minutesPlayed,
      goals: stat.goals,
      points: stat.points,
    }));
    const totalGoals = player.stats.reduce((sum: number, stat: any) => sum + (stat.goals || 0), 0);
    return {
      ...player,
      goals: totalGoals,
      stats,
    };
  }

  async findByTeam(teamId: string): Promise<PlayerRecord[]> {
    const players = await this.prisma.player.findMany({
      where: { teamId },
      include: {
        stats: { include: { match: true } },
      },
    });
    return players.map((player: any) => {
      const stats = player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      }));
      const totalGoals = player.stats.reduce((sum: number, stat: any) => sum + (stat.goals || 0), 0);
      return {
        ...player,
        goals: totalGoals,
        stats,
      };
    });
  }

  async createPlayerMatchStat(payload: PlayerMatchStatPayload): Promise<void> {
    await this.prisma.playerMatchStat.upsert({
      where: { playerId_matchId: { playerId: payload.playerId, matchId: payload.matchId } },
      update: {
        minutesPlayed: payload.minutesPlayed,
        goals: payload.goals,
        cleanSheet: payload.cleanSheet,
        points: payload.points,
      },
      create: {
        playerId: payload.playerId,
        matchId: payload.matchId,
        minutesPlayed: payload.minutesPlayed,
        goals: payload.goals,
        cleanSheet: payload.cleanSheet,
        points: payload.points,
      },
    });
  }

  async refreshSeasonPoints(categoryId: string): Promise<void> {
    // Use raw SQL for batch update to avoid N+1 query problem
    await this.prisma.$executeRaw`
      UPDATE "Player" p
      SET "seasonPoints" = COALESCE((
        SELECT SUM(pms."points")
        FROM "PlayerMatchStat" pms
        WHERE pms."playerId" = p."id"
      ), 0)
      WHERE p."categoryId" = ${categoryId}
    `;
  }

  async findTopScorersByCategory(categoryId: string): Promise<PlayerRecord[]> {
    const players = await this.prisma.player.findMany({
      where: { categoryId },
      include: {
        stats: { include: { match: true } },
      },
    });

    const playersWithGoals = players.map((player: any) => {
      const stats = player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      }));
      const totalGoals = player.stats.reduce((sum: number, stat: any) => sum + (stat.goals || 0), 0);
      return {
        ...player,
        goals: totalGoals,
        stats,
      } as PlayerRecord;
    });

    return playersWithGoals
      .sort((a: any, b: any) => {
        if (b.goals !== a.goals) return b.goals - a.goals;
        if (b.seasonPoints !== a.seasonPoints) return b.seasonPoints - a.seasonPoints;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);
  }
}
