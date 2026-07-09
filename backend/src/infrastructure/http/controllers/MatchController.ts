import { Request, Response } from 'express';
import { repositories } from '../../../config/container';
import { MatchService } from '../../../application/MatchService';
import { MatchDTO, PlayerDTO, PlayerMatchRatingDTO } from '../../../types';

const matchService = new MatchService(repositories.matchRepository, repositories.playerRepository);

export class MatchController {
  async listByCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const status = req.query.status as string | undefined;
    const matches = await repositories.matchRepository.findByCategory(categoryId, status);
    res.json(matches.map((match) => ({
      id: match.id,
      categoryId: match.categoryId,
      home: { id: match.homeId, name: match.home?.name ?? '' },
      away: { id: match.awayId, name: match.away?.name ?? '' },
      date: match.date.toISOString(),
      venue: match.venue,
      status: match.status as 'scheduled' | 'live' | 'finished',
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
    })));
  }

  async getMatchDetails(req: Request, res: Response) {
    const matchId = req.params.matchId;
    const match = await repositories.matchRepository.findByIdWithDetails(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const players = await repositories.playerRepository.findByCategory(match.categoryId);
    const ratingItems = players
      .filter((player) => player.teamId === match.homeId || player.teamId === match.awayId)
      .map((player) => {
        const opponent = player.teamId === match.homeId ? match.away?.name ?? '' : match.home?.name ?? '';
        const playerDTO: PlayerDTO = {
          id: player.id,
          name: player.name,
          cardPhotoUrl: player.cardPhotoUrl,
          position: player.position as any,
          jerseyNumber: player.jerseyNumber,
          teamId: player.teamId,
          categoryId: player.categoryId,
          seasonPoints: player.seasonPoints,
          goals: player.goals,
        };
        return {
          matchId: match.id,
          opponent,
          date: match.date.toISOString(),
          minutesPlayed: 0,
          goals: 0,
          points: 0,
          player: playerDTO,
        };
      });

    res.json({
      match: {
        id: match.id,
        categoryId: match.categoryId,
        home: { id: match.homeId, name: match.home?.name ?? '' },
        away: { id: match.awayId, name: match.away?.name ?? '' },
        date: match.date.toISOString(),
        venue: match.venue,
        status: match.status as 'scheduled' | 'live' | 'finished',
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      } as MatchDTO,
      ratings: ratingItems as Array<PlayerMatchRatingDTO & { player: PlayerDTO }>,
    });
  }

  async recordResult(req: Request, res: Response) {
    const payload = req.body;
    await matchService.recordResult(payload);
    res.status(204).send();
  }
}
