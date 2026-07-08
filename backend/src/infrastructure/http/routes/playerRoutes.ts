import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';

const router = Router();
const controller = new PlayerController();

router.get('/categories/:categoryId/players', controller.listByCategory.bind(controller));
router.get('/players/:playerId', controller.getPlayer.bind(controller));

export default router;
