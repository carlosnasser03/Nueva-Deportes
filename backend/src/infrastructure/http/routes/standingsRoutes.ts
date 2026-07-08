import { Router } from 'express';
import { StandingsController } from '../controllers/StandingsController';

const router = Router();
const controller = new StandingsController();

router.get('/categories/:categoryId/standings', controller.getStandings.bind(controller));

export default router;
