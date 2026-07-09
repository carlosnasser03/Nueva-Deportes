import { Router } from 'express';
import { CategoryController, initializePrismaClient } from '../controllers/CategoryController';

const router = Router();

// Ensure Prisma client is initialized
initializePrismaClient();
const controller = new CategoryController();

router.get('/', controller.list.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
