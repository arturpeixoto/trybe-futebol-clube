// import { ICRUDModelCreator, ICRUDModelReader, ICRUDModelUpdater } from '../ICRUDModel';
import { ICRUDModelReader } from '../ICRUDModel';
import { IMatch, IMatchReturn } from './IMatch';

export interface IMatchModel extends ICRUDModelReader<IMatch> {
  findByInProgress(inProgress: IMatch['inProgress']): Promise<IMatchReturn[]>
}
// | ICRUDModelCreator<IMatch> |
// ICRUDModelUpdater<IMatch>;
