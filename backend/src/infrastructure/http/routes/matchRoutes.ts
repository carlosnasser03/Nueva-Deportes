import { Router } from 'express';
import { MatchController } from '../controllers/MatchController';

const router = Router();
const controller = new MatchController();

router.get('/categories/:categoryId/matches', controller.listByCategory.bind(controller));
router.get('/matches/:matchId', controller.getMatchDetails.bind(controller));
router.post('/matches/:matchId/result', controller.recordResult.bind(controller));

export default router;
