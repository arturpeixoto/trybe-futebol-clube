import { ServiceResponse } from '../Interfaces/ServiceResponse';
import LeaderboardModel from '../models/LeaderboardModel';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';

export default class LeaderboardService {
  constructor(
    private leaderboardModel = new LeaderboardModel(),
  ) { }

  async getLeaderboardAway(): Promise<ServiceResponse<ILeaderboard[]>> {
    const leaderboard = await this.leaderboardModel.leaderboardAway();
    return { status: 'SUCCESSFUL', data: leaderboard };
  }

  async getLeaderboardHome(): Promise<ServiceResponse<ILeaderboard[]>> {
    const leaderboard = await this.leaderboardModel.leaderboardHome();
    return { status: 'SUCCESSFUL', data: leaderboard };
  }
}
