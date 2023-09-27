import { Identifiable } from '..';

export type homeTeam = {
  teamName: string;
};

export type awayTeam = {
  teamName: string;
};

export interface IMatchCreate extends Identifiable {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
}

export interface IMatch extends IMatchCreate {
  inProgress: boolean;
}

export interface IMatchReturn extends IMatch {
  homeTeam: homeTeam;
  awayTeam: awayTeam;
}

export type IMatchFinished = {
  message: string;
};
