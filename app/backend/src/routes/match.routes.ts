import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';
import Validations from '../middlewares/Validations';

const router = Router();

const matchController = new MatchController();

router.patch(
  '/:id/finish',
  Validations.validateToken,
  (req, res) => matchController.finishMatch(req, res),
);

router.patch(
  '/:id',
  Validations.validateToken,
  Validations.validateUpdateMatch,
  (req, res) => matchController.updateMatch(req, res),
);

router.get(
  '/:id',
  (req: Request, res: Response) => matchController.getMatchById(req, res),
);

router.get(
  '/',
  (req: Request, res: Response) => {
    const { inProgress } = req.query;
    if (inProgress) {
      matchController.getMatchByInProgress(req, res);
    } else {
      matchController.getAllMatches(req, res);
    }
  },
);

router.post(
  '/',
  Validations.validateToken,
  Validations.validateCreateMatch,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);

export default router;
