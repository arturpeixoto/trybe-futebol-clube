import {
  GoalsInMatches,
  ILeaderboard,
  THomeOrAway,
  TeamResults,
} from './ILeaderboard';

export interface ILeaderboardModel {
  leaderboardAway(): Promise<ILeaderboard[]>;
  leaderboardHome(): Promise<ILeaderboard[]>;
  leaderboardTotal(): Promise<ILeaderboard[]>;
  getTeams(): Promise<void>;
  getMatches(): Promise<void>;
  getGoals(id: number, homeOrAway: THomeOrAway): GoalsInMatches;
  getResults(id: number, homeOrAway: THomeOrAway): TeamResults;
  formulateAwayLeaderboard(): void;
  formulateHomeLeaderboard(): void;
  formulateTotalLeaderboard(): void;
}
