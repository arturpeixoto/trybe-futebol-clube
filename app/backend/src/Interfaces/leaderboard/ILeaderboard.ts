export interface GoalsInMatches {
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
}

export interface TeamResults {
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
}

export interface SummaryOfResults {
  totalPoints: number;
  totalGames: number;
  efficiency: number;
}

export interface ILeaderboard extends GoalsInMatches, TeamResults, SummaryOfResults {
  name: string;
}

export type THomeOrAway = 'home' | 'away';
export type THomeOrAwayId = 'homeTeamId' | 'awayTeamId';
export type THomeOrAwayGoals = 'homeTeamGoals' | 'awayTeamGoals';
