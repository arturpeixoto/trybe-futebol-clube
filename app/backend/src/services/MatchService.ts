import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';
import { IMatch, IMatchCreate, IMatchFinished, IMatchReturn } from '../Interfaces/matches/IMatch';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatchReturn[]>> {
    const allMatches = await this.matchModel.findAll() as IMatchReturn[];
    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async getMatchById(id: number): Promise<ServiceResponse<IMatchReturn>> {
    const match = await this.matchModel.findById(id) as IMatchReturn;
    if (!match) return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
    return { status: 'SUCCESSFUL', data: match };
  }

  public async getMatchByInProgress(inProgress: boolean): Promise<ServiceResponse<IMatchReturn[]>> {
    const allMatches = await this.matchModel.findByInProgress(inProgress) as IMatchReturn[];
    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<IMatchFinished>> {
    const match = await this.matchModel.finishMatch(id);
    if (match.message.includes('not found')) return { status: 'NOT_FOUND', data: match };
    if (match.message.includes('already finished')) return { status: 'INVALID_DATA', data: match };
    return { status: 'SUCCESSFUL', data: match };
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<ServiceResponse<IMatchFinished>> {
    const match = await this.matchModel.updateMatch(id, homeTeamGoals, awayTeamGoals);
    if (match.message.includes('not found')) return { status: 'NOT_FOUND', data: match };
    if (match.message.includes('already finished')) return { status: 'INVALID_DATA', data: match };
    return { status: 'SUCCESSFUL', data: match };
  }

  public async createMatch(matchCreate: IMatchCreate): Promise<ServiceResponse<IMatch>> {
    const data = await this.matchModel.create(matchCreate) as IMatch | null;
    if (!data) return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    return { status: 'CREATED', data };
  }
}
