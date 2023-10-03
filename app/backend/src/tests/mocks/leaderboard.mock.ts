const matchesLeaderboard = [
  {
  id: 1, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: false,
  },
  {
    id: 2, 
    homeTeamId: 2,
    homeTeamGoals: 1,
    awayTeamId: 1,
    awayTeamGoals: 1,
    inProgress: false,
    },
]

const teamsLeaderboard = [
  {
    dataValues: 
    {
      id: 1,
      teamName: 'Cruzeiro',
    },
  },
  {
    dataValues:
    {
      id:2,
      teamName: 'Atlético-MG',
    }
  },
];

const leaderboardHome = [
  {
    name: "Cruzeiro",
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 0,
    goalsBalance: 3,
    efficiency: 100,
  },
  {
    name: 'Atlético-MG',
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: 33.33
  },
]

const leaderboardAway = [
  {
    name: "Cruzeiro",
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: 33.33,
  },
  {
    name: "Atlético-MG",
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 3,
    goalsBalance: -3,
    efficiency: 0,
  },
]

const leaderboardTotal = [
  {
    name: "Cruzeiro",
    totalPoints: 4,
    totalGames: 2,
    totalVictories: 1,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 4,
    goalsOwn: 1,
    goalsBalance: 3,
    efficiency: 66.67,
  },
  {
    name: "Atlético-MG",
    totalPoints: 1,
    totalGames: 2,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 4,
    goalsBalance: -3,
    efficiency: 16.67,
  },
]

export {
  matchesLeaderboard,
  teamsLeaderboard,
  leaderboardAway,
  leaderboardHome,
  leaderboardTotal,
}