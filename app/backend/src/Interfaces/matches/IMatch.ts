import { Identifiable } from '..';

export interface IMatch extends Identifiable {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export type homeTeam = {
  teamName: string;
};

export type awayTeam = {
  teamName: string;
};

export interface IMatchReturn extends Identifiable {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
  homeTeam: homeTeam;
  awayTeam: awayTeam;
}
