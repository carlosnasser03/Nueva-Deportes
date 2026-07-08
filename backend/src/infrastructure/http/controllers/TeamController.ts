import { Request, Response } from 'express';
import { repositories } from '../../../config/container';

export class TeamController {
  async getTeam(req: Request, res: Response) {
    const teamId = req.params.teamId;
    const team = await repositories.teamRepository.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const players = await repositories.playerRepository.findByTeam(teamId);
    res.json({
      team,
      players: players.map((player) => ({
        id: player.id,
        name: player.name,
        cardPhotoUrl: player.cardPhotoUrl,
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        teamId: player.teamId,
        categoryId: player.categoryId,
        seasonPoints: player.seasonPoints,
        goals: player.goals,
      })),
    });
  }

  async listByCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const teams = await repositories.teamRepository.findByCategory(categoryId);
    res.json(teams);
  }
}
