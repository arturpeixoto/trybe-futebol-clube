import { Router } from 'express';
import teamRouter from './team.routes';
import userRouter from './user.routes';

const router = Router();

router.use('/login', userRouter);
router.use('/teams', teamRouter);

export default router;
