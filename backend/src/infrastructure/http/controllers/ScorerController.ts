import { Request, Response } from 'express';
import { ScorerService } from '../../../application/ScorerService';
import { repositories } from '../../../config/container';

const scorerService = new ScorerService(repositories.playerRepository);

export class ScorerController {
  async list(req: Request, res: Response) {
    const categoryId = req.params.categoryId;
    const scorers = await scorerService.getTopScorers(categoryId);
    res.json(scorers);
  }
}
