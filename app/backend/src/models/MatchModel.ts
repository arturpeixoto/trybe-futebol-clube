import { IMatch, IMatchReturn } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  async findAll(): Promise<IMatchReturn[]> {
    const dbData = await this.model.findAll({
      include: [{ model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] }],
    }) as unknown as IMatchReturn[];
    return dbData.map((
      { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam },
    ) => (
      { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam }
    ));
  }

  async findById(id: IMatch['id']): Promise<IMatchReturn | null> {
    const dbData = await this.model.findByPk(id, {
      include: [{ model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] }],
    }) as unknown as IMatchReturn;
    if (dbData == null) return null;

    const { homeTeamId, homeTeamGoals, awayTeamId,
      awayTeamGoals, inProgress, homeTeam, awayTeam }: IMatchReturn = dbData;
    return {
      id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam,
    };
  }

  async findByInProgress(inProgress: IMatch['inProgress']): Promise<IMatchReturn[]> {
    const dbData = await this.model.findAll({
      include: [{ model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] }],
      where: { inProgress },
    }) as unknown as IMatchReturn[];
    return dbData.map((
      { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, homeTeam, awayTeam },
    ) => (
      { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress, homeTeam, awayTeam }
    ));
  }
}
