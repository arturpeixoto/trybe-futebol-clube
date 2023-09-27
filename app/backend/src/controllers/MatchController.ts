import { Request, Response } from 'express';
import { IMatchCreate } from '../Interfaces/matches/IMatch';
import MatchService from '../services/MatchService';
import mapStatusHTTP from '../utils/mapStatusToHTTP';

export default class TeamController {
  constructor(
    private matchService = new MatchService(),
  ) { }

  public async getAllMatches(_req: Request, res: Response) {
    const { status, data } = await this.matchService.getAllMatches();
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getMatchById(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.matchService.getMatchById(Number(id));
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getMatchByInProgress(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (!inProgress || (inProgress !== 'true' && inProgress !== 'false')) {
      res.status(400).json({ message: 'BADREQUEST' });
    }
    const { status, data } = await this.matchService.getMatchByInProgress(inProgress === 'true');
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.matchService.finishMatch(Number(id));
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { status, data } = await this.matchService
      .updateMatch(Number(id), Number(homeTeamGoals), Number(awayTeamGoals));
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async createMatch(req: Request, res: Response) {
    const dataBody: IMatchCreate = req.body;
    const { status, data } = await this.matchService.createMatch(dataBody);
    res.status(mapStatusHTTP(status)).json(data);
  }
}
