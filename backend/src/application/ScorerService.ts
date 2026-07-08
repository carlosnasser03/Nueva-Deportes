import { IPlayerRepository } from '../infrastructure/repositories/interfaces/IPlayerRepository';
import { ScorerDTO } from '../../../shared/types';

export class ScorerService {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  async getTopScorers(categoryId: string): Promise<ScorerDTO[]> {
    const players = await this.playerRepository.findTopScorersByCategory(categoryId);

    return players.map((player, index) => ({
      position: index + 1,
      player: {
        id: player.id,
        name: player.name,
        cardPhotoUrl: player.cardPhotoUrl,
        position: player.position as any,
        jerseyNumber: player.jerseyNumber,
        teamId: player.teamId,
        categoryId: player.categoryId,
        seasonPoints: player.seasonPoints,
        goals: player.goals,
      },
      goals: player.goals,
    }));
  }
}
