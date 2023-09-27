import { IMatch, IMatchCreate, IMatchFinished, IMatchReturn } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private teamModel = SequelizeTeam;

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

  async finishMatch(id: number): Promise<IMatchFinished> {
    const match = await this.model.findByPk(id);
    if (!match) {
      return { message: `Match with id ${id} not found.` };
    }
    if (match.inProgress === false) {
      return { message: `Match with id ${id} already finished.` };
    }
    await match.update({ inProgress: false });
    return { message: 'Finished' };
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<IMatchFinished> {
    const match = await this.model.findByPk(id);
    if (!match) {
      return { message: `Match with id ${id} not found.` };
    }
    if (match.inProgress === false) {
      return { message: `Match with id ${id} already finished.` };
    }
    await match.update({ homeTeamGoals, awayTeamGoals });
    return { message: 'Updated' };
  }

  async create(data: IMatchCreate): Promise<IMatch | null> {
    const homeTeam = await this.teamModel.findByPk(data.homeTeamId);
    const awayTeam = await this.teamModel.findByPk(data.awayTeamId);
    if (!homeTeam || !awayTeam) {
      return null;
    }
    const matchData = { ...data, inProgress: true };
    const dbData = await this.model.create(matchData);
    const { id, homeTeamId, homeTeamGoals, awayTeamId,
      awayTeamGoals, inProgress }: IMatch = dbData;
    return {
      id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress,
    };
  }
}
