import { IMatch } from '../Interfaces/matches/IMatch';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import {
  GoalsInMatches,
  ILeaderboard,
  SummaryOfResults,
  TeamResults,
  THomeOrAway,
} from '../Interfaces/leaderboard/ILeaderboard';
import { ITeam } from '../Interfaces/teams/ITeam';
import { ILeaderboardModel } from '../Interfaces/leaderboard/ILeaderboardModel';

export default class LeaderboardModel implements ILeaderboardModel {
  private matchModel = SequelizeMatch;
  private teamModel = SequelizeTeam;
  private matches: IMatch[] = [];
  private teams: ITeam[] = [];
  private teamsId: number[] = [];
  private _leaderboardAway: ILeaderboard[] = [];
  private _leaderboardHome: ILeaderboard[] = [];
  private _leaderboardTotal: ILeaderboard[] = [];

  async leaderboardAway(): Promise<ILeaderboard[]> {
    this._leaderboardAway = [];
    await this.getMatches();
    await this.getTeams();
    this.formulateAwayLeaderboard();
    return LeaderboardModel.order(this._leaderboardAway);
  }

  async leaderboardHome(): Promise<ILeaderboard[]> {
    this._leaderboardHome = [];
    await this.getMatches();
    await this.getTeams();
    this.formulateHomeLeaderboard();
    return LeaderboardModel.order(this._leaderboardHome);
  }

  async leaderboardTotal(): Promise<ILeaderboard[]> {
    this._leaderboardAway = [];
    this._leaderboardTotal = [];
    this._leaderboardHome = [];
    await this.getMatches();
    await this.getTeams();
    this.formulateAwayLeaderboard();
    this.formulateHomeLeaderboard();
    this.formulateTotalLeaderboard();
    const orderedLeaderboard = LeaderboardModel.order(this._leaderboardTotal);
    return orderedLeaderboard;
  }

  async getTeams() {
    this.teamsId = [];
    this.teams = [];
    const allTeams = await this.teamModel.findAll();
    this.teams = allTeams
      .map((team) => team.dataValues) as unknown as ITeam[];
    this.teamsId = this.teams.map((team) => team.id);
  }

  async getMatches(): Promise<void> {
    this.matches = [];
    this.matches = await this.matchModel.findAll({ where: { inProgress: false } });
  }

  getGoals(id: number, homeOrAway: THomeOrAway): GoalsInMatches {
    const adversary: THomeOrAway = homeOrAway === 'home' ? 'away' : 'home';
    const teamMatches = this.matches.filter((match) => match[`${homeOrAway}TeamId`] === id);
    const favorGoals = teamMatches
      .reduce((total, match) => total + match[`${homeOrAway}TeamGoals`], 0);
    const ownGoals = teamMatches
      .reduce((total, match) => total + match[`${adversary}TeamGoals`], 0);
    return { goalsFavor: favorGoals, goalsOwn: ownGoals, goalsBalance: favorGoals - ownGoals };
  }

  getResults(id: number, homeOrAway: THomeOrAway): TeamResults {
    const adversary: THomeOrAway = homeOrAway === 'home' ? 'away' : 'home';
    const teamMatches = this.matches.filter((match) => match[`${homeOrAway}TeamId`] === id);
    const results: TeamResults = { totalVictories: 0, totalDraws: 0, totalLosses: 0 };
    const isVictory = (teamGoals: number, adversaryGoals: number) => teamGoals > adversaryGoals;
    const isDraw = (teamGoals: number, adversaryGoals: number) => teamGoals === adversaryGoals;
    const isLoss = (teamGoals: number, adversaryGoals: number) => teamGoals < adversaryGoals;
    const updateResults = (match: IMatch) => {
      const teamGoals = match[`${homeOrAway}TeamGoals`];
      const adversaryGoals = match[`${adversary}TeamGoals`];
      if (isVictory(teamGoals, adversaryGoals)) {
        results.totalVictories += 1;
      } else if (isDraw(teamGoals, adversaryGoals)) {
        results.totalDraws += 1;
      } else if (isLoss(teamGoals, adversaryGoals)) { results.totalLosses += 1; }
    };
    teamMatches.forEach((match) => updateResults(match));
    return results;
  }

  static getSummary(results: TeamResults): SummaryOfResults {
    const totalPoints = results.totalVictories * 3 + results.totalDraws;
    const totalGames = results.totalDraws + results.totalLosses + results.totalVictories;
    const efficiency = totalGames === 0 ? 0
      : Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
    return { totalPoints, totalGames, efficiency };
  }

  public formulateAwayLeaderboard() {
    const away = 'away';
    this.teamsId.forEach((teamId) => {
      const goals = this.getGoals(teamId, away);
      const results = this.getResults(teamId, away);
      const { totalGames, totalPoints, efficiency } = LeaderboardModel.getSummary(results);
      const teamLeaderboard = { totalPoints, totalGames, ...results, ...goals, efficiency };
      const { teamName } = this.teams[teamId - 1];
      this._leaderboardAway.push({ name: teamName, ...teamLeaderboard });
    });
  }

  public formulateHomeLeaderboard() {
    const home = 'home';
    this.teamsId.forEach((teamId) => {
      const goals = this.getGoals(teamId, home);
      const results = this.getResults(teamId, home);
      const { totalGames, totalPoints, efficiency } = LeaderboardModel.getSummary(results);
      const teamLeaderboard = { totalPoints, totalGames, ...results, ...goals, efficiency };
      const { teamName } = this.teams[teamId - 1];
      this._leaderboardHome.push({ name: teamName, ...teamLeaderboard });
    });
  }

  public static calculateTeamStats(teamName: string, homeLeaderboard: ILeaderboard, awayLeaderboard:
  ILeaderboard): ILeaderboard {
    return {
      name: teamName,
      totalPoints: homeLeaderboard.totalPoints + awayLeaderboard.totalPoints,
      totalGames: homeLeaderboard.totalGames + awayLeaderboard.totalGames,
      totalVictories: homeLeaderboard.totalVictories + awayLeaderboard.totalVictories,
      totalDraws: homeLeaderboard.totalDraws + awayLeaderboard.totalDraws,
      totalLosses: homeLeaderboard.totalLosses + awayLeaderboard.totalLosses,
      goalsFavor: homeLeaderboard.goalsFavor + awayLeaderboard.goalsFavor,
      goalsOwn: homeLeaderboard.goalsOwn + awayLeaderboard.goalsOwn,
      goalsBalance: homeLeaderboard.goalsBalance + awayLeaderboard.goalsBalance,
      efficiency: homeLeaderboard.totalGames + awayLeaderboard.totalGames === 0 ? 0
        : Number((((homeLeaderboard.totalPoints + awayLeaderboard.totalPoints)
       / ((homeLeaderboard.totalGames + awayLeaderboard.totalGames) * 3)) * 100).toFixed(2)),
    };
  }

  public formulateTotalLeaderboard() {
    this.teams.forEach((team) => {
      if (!this._leaderboardTotal.find((time) => team.teamName === time.name)) {
        const homeLeaderboard = this._leaderboardHome
          .find((stats) => stats.name === team.teamName) as ILeaderboard;
        const awayLeaderboard = this._leaderboardAway
          .find((stats) => stats.name === team.teamName) as ILeaderboard;
        const finalLeaderboard = LeaderboardModel
          .calculateTeamStats(team.teamName, homeLeaderboard, awayLeaderboard);
        this._leaderboardTotal.push(finalLeaderboard);
      }
    });
  }

  static order(data: ILeaderboard[]): ILeaderboard[] {
    return data.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalVictories > b.totalVictories) return -1;
      if (a.totalVictories < b.totalVictories) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      return 0;
    });
  }
}
