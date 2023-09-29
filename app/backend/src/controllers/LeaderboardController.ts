import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusToHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) { }

  public async getLeaderboardAway(_req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getLeaderboardAway();
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getLeaderboardHome(_req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getLeaderboardHome();
    res.status(mapStatusHTTP(status)).json(data);
  }
}
