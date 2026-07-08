import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const controller = new CategoryController();

router.get('/', controller.list.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
