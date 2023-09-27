// import { ICRUDModelCreator, ICRUDModelReader, ICRUDModelUpdater } from '../ICRUDModel';
import { ICRUDModelCreator, ICRUDModelReader } from '../ICRUDModel';
import { IMatch, IMatchCreate, IMatchFinished, IMatchReturn } from './IMatch';

export interface IMatchModel extends ICRUDModelReader<IMatch>,
  ICRUDModelCreator<IMatchCreate | null> {
  findByInProgress(inProgress: IMatch['inProgress']): Promise<IMatchReturn[]>,
  finishMatch(id: IMatch['id']): Promise<IMatchFinished>,
  updateMatch(
    id: IMatch['id'],
    homeTeamGoals: IMatch['homeTeamGoals'],
    awayTeamGoals: IMatch['awayTeamGoals']
  ): Promise<IMatchFinished>
}
// | ICRUDModelCreator<IMatch> |
// ICRUDModelUpdater<IMatch>;
