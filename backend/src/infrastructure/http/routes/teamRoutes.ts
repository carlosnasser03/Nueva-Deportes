import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';

const router = Router();
const controller = new TeamController();

router.get('/teams/:teamId', controller.getTeam.bind(controller));
router.get('/categories/:categoryId/teams', controller.listByCategory.bind(controller));

export default router;
