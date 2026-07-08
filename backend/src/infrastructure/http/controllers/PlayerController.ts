import { Request, Response } from 'express';
import { repositories } from '../../../config/container';
import { PlayerService } from '../../../application/PlayerService';

const playerService = new PlayerService(repositories.playerRepository);

export class PlayerController {
  async listByCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const players = await playerService.getPlayersByCategory(categoryId);
    res.json(players);
  }

  async getPlayer(req: Request, res: Response) {
    const playerId = req.params.playerId;
    const player = await playerService.getPlayerProfile(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  }
}
