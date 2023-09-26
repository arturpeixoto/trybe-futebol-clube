import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusToHTTP';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) { }

  public async login(req: Request, res: Response) {
    const { status, data } = await this.userService.login(req.body);
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }

    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getRole(req: Request, res: Response) {
    const token = req.headers.authorization as string;
    const { status, data } = await this.userService.getRole(token);
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }

    res.status(mapStatusHTTP(status)).json(data);
  }
}
