import { createDefaultScoringEngine, PlayerMatchInput } from '../domain/scoring/engine';
import { IMatchRepository } from '../infrastructure/repositories/interfaces/IMatchRepository';
import { IPlayerRepository } from '../infrastructure/repositories/interfaces/IPlayerRepository';
import type { Position } from '@shared';

export interface MatchResultPayload {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  playerRatings: Array<{
    playerId: string;
    minutesPlayed: number;
    goals: number;
  }>;
}

export class MatchService {
  constructor(
    private readonly matchRepository: IMatchRepository,
    private readonly playerRepository: IPlayerRepository
  ) {}

  async recordResult(payload: MatchResultPayload): Promise<void> {
    const match = await this.matchRepository.findById(payload.matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    await this.matchRepository.updateScore(payload.matchId, payload.homeGoals, payload.awayGoals);

    const homeGoals = payload.homeGoals;
    const awayGoals = payload.awayGoals;
    const duration = 80;
    const engine = createDefaultScoringEngine();

    for (const rating of payload.playerRatings) {
      const player = await this.playerRepository.findById(rating.playerId);
      if (!player) continue;
      if (player.categoryId !== match.categoryId) {
        throw new Error('Player category mismatch');
      }
      const teamGoals = player.teamId === match.homeId ? homeGoals : awayGoals;
      const input: PlayerMatchInput = {
        position: player.position as Position,
        minutesPlayed: rating.minutesPlayed,
        matchDurationMinutes: duration,
        goalsScored: rating.goals,
        teamGoals,
        teamCleanSheet:
          player.teamId === match.homeId ? awayGoals === 0 : homeGoals === 0,
      };
      const scoring = engine.calculate(input);
      await this.playerRepository.createPlayerMatchStat({
        playerId: player.id,
        matchId: payload.matchId,
        minutesPlayed: rating.minutesPlayed,
        goals: rating.goals,
        cleanSheet: scoring.breakdown.some((item) => item.concept === 'Portería a cero'),
        points: scoring.total,
      });
    }

    await this.playerRepository.refreshSeasonPoints(match.categoryId);
  }
}
