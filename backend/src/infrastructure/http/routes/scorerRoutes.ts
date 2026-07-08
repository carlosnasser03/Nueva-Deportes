import { Router } from 'express';
import { ScorerController } from '../controllers/ScorerController';

const router = Router();
const controller = new ScorerController();

router.get('/categories/:categoryId/scorers', controller.list.bind(controller));

export default router;
