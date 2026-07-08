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
    return players.map((player: any) => ({
      ...player,
      stats: player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      })),
    }));
  }

  async findById(playerId: string): Promise<PlayerRecord | null> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: { include: { match: true } },
      },
    });
    if (!player) return null;
    return {
      ...player,
      stats: player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      })),
    };
  }

  async findByTeam(teamId: string): Promise<PlayerRecord[]> {
    const players = await this.prisma.player.findMany({
      where: { teamId },
      include: {
        stats: { include: { match: true } },
      },
    });
    return players.map((player: any) => ({
      ...player,
      stats: player.stats.map((stat: any) => ({
        matchId: stat.matchId,
        match: { id: stat.match.id, date: stat.match.date },
        minutesPlayed: stat.minutesPlayed,
        goals: stat.goals,
        points: stat.points,
      })),
    }));
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
    const players = await this.prisma.player.findMany({
      where: { categoryId },
      include: { stats: true },
    });

    await Promise.all(
      players.map((player: any) =>
        this.prisma.player.update({
          where: { id: player.id },
          data: {
            seasonPoints: player.stats.reduce((sum: number, stat: any) => sum + stat.points, 0),
          },
        })
      )
    );
  }

  async findTopScorersByCategory(categoryId: string): Promise<PlayerRecord[]> {
    const players = await this.prisma.player.findMany({
      where: { categoryId },
      orderBy: [{ goals: 'desc' }, { seasonPoints: 'desc' }, { name: 'asc' }],
      take: 10,
    });
    return players as PlayerRecord[];
  }
}
