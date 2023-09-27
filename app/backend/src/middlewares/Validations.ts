import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

const invalidaDataString = 'Invalid data';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const withoutBearer = token.split(' ')[1];
    const validToken = JWT.verify(withoutBearer);
    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }
    next();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNumber(value: any): boolean {
    return !Number.isNaN(parseFloat(value)) && Number.isFinite(value);
  }

  static async validateCreateMatch(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const { homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId } = req.body;
    if (!Validations.isNumber(homeTeamGoals) || !Validations.isNumber(awayTeamGoals)) {
      return res.status(422).json(
        { message: invalidaDataString },
      );
    }
    if (!Validations.isNumber(homeTeamId) || !Validations.isNumber(awayTeamId)) {
      return res.status(422).json(
        { message: invalidaDataString },
      );
    }
    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }
    next();
  }

  static async validateUpdateMatch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    if (!Number(Number(homeTeamGoals)) || !Number(Number(awayTeamGoals))) {
      return res.status(422).json(
        { message: invalidaDataString },
      );
    }
    next();
  }
}
