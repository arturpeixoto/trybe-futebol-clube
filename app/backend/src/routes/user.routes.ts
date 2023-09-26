import { Router } from 'express';
import UsersController from '../controllers/UserController';
import Validations from '../middlewares/Validations';

const userController = new UsersController();

const router = Router();

router.post(
  '/',
  Validations.validateLogin,
  (req, res) => userController.login(req, res),
);

router.get(
  '/role',
  Validations.validateToken,
  (req, res) => userController.getRole(req, res),
);

export default router;
