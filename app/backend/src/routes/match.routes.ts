import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchController = new MatchController();

router.get('/:id', (req: Request, res: Response) => matchController.getMatchById(req, res));

router.get('/', (req: Request, res: Response) => {
  const { inProgress } = req.query;
  if (inProgress) {
    matchController.getMatchByInProgress(req, res);
  } else {
    matchController.getAllMatches(req, res);
  }
});

export default router;
