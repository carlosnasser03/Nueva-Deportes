import { IPlayerRepository } from '../infrastructure/repositories/interfaces/IPlayerRepository';
import { PlayerDTO, PlayerProfileDTO, Position } from '@shared';

export class PlayerService {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async getPlayersByCategory(categoryId: string): Promise<PlayerDTO[]> {
    const players = await this.playerRepository.findByCategory(categoryId);
    return players.map((player) => ({
      id: player.id,
      name: player.name,
      cardPhotoUrl: player.cardPhotoUrl,
      position: player.position as Position,
      jerseyNumber: player.jerseyNumber,
      teamId: player.teamId,
      categoryId: player.categoryId,
      seasonPoints: player.seasonPoints,
      goals: player.goals,
    }));
  }

  async getPlayerProfile(playerId: string): Promise<PlayerProfileDTO | null> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) return null;

    const history = player.stats.map((stat) => ({
      matchId: stat.matchId,
      opponent: stat.matchId,
      date: stat.match.date.toISOString(),
      minutesPlayed: stat.minutesPlayed,
      goals: stat.goals,
      points: stat.points,
    }));

    return {
      id: player.id,
      name: player.name,
      cardPhotoUrl: player.cardPhotoUrl,
      position: player.position as Position,
      jerseyNumber: player.jerseyNumber,
      teamId: player.teamId,
      categoryId: player.categoryId,
      seasonPoints: player.seasonPoints,
      goals: player.goals,
      matchesPlayed: history.length,
      breakdown: [],
      history,
    };
  }
}
