import { Request, Response } from 'express';
import { StandingsService } from '../../../application/StandingsService';
import { repositories } from '../../../config/container';

const standingsService = new StandingsService(repositories.matchRepository);

export class StandingsController {
  async getStandings(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const standings = await standingsService.getStandings(categoryId);
    res.json(standings);
  }
}
