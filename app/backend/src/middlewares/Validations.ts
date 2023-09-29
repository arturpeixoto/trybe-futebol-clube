import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

const invalidDataString = 'Invalid data';

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
    const validToken = await JWT.verify(withoutBearer);
    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }
    next();
  }

  static isValidNumber(value: number | string | undefined | null) {
    if (typeof value !== 'number') {
      return false;
    }
    return Number.isInteger(value) && value >= 0;
  }

  static async validateCreateMatch(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    try {
      const { homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId } = req.body;
      if (!Validations.isValidNumber(homeTeamGoals) || !Validations.isValidNumber(awayTeamGoals)) {
        throw new Error(invalidDataString);
      } if (!Validations.isValidNumber(homeTeamId) || !Validations.isValidNumber(awayTeamId)) {
        throw new Error(invalidDataString);
      } if (homeTeamId === awayTeamId) {
        throw new Error('It is not possible to create a match with two equal teams');
      }
      next();
    } catch (error) {
      const e = error as Error;
      if (e.message.includes('equal teams')) {
        return res.status(422).json({ message: e.message });
      } return res.status(422).json({ message: e.message });
    }
  }

  static async validateUpdateMatch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    if (!Number(Number(homeTeamGoals)) || !Number(Number(awayTeamGoals))) {
      return res.status(422).json(
        { message: invalidDataString },
      );
    }
    next();
  }
}
