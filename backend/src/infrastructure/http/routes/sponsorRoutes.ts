import { Router } from 'express';
import { SponsorController } from '../controllers/SponsorController';

const router = Router();
const controller = new SponsorController();

router.get('/sponsors', controller.list.bind(controller));

export default router;
