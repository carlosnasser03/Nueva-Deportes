import { Request, Response } from 'express';
import { repositories } from '../../../config/container';

export class SponsorController {
  async list(req: Request, res: Response) {
    const placement = req.query.placement as string;
    const categoryId = req.query.categoryId as string | undefined;
    const sponsors = await repositories.sponsorRepository.findByPlacementAndCategory(placement, categoryId);
    res.json(sponsors);
  }
}
