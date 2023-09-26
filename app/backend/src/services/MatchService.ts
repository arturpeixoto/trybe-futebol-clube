import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';
import { IMatchReturn } from '../Interfaces/matches/IMatch';

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
}
