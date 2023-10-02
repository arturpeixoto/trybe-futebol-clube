const match = {
  id: 1, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: false,
  homeTeam: {
    teamName: 'Cruzeiro'
  },
  awayTeam: {
    teamName: 'Atlético MG'
  }
}

const match2 = {
  id: 2, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: true,
  homeTeam: {
    teamName: 'Cruzeiro'
  },
  awayTeam: {
    teamName: 'Atlético MG'
  }
}

const match1FromDB = {
  id: 1, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: false,
}

const match2FromDB = {
  id: 2, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: true,
}

const match2Updated = {
  id: 2, 
  homeTeamId: 1,
  homeTeamGoals: 3,
  awayTeamId: 2,
  awayTeamGoals: 0,
  inProgress: false,
}

const returnedCreatedMatch = {
  "id": 3,
  "homeTeamId": 1,
  "homeTeamGoals": 3,
  "awayTeamId": 2,
  "awayTeamGoals": 0,
  "inProgress": true
}


const allMatchesNotInProgress = [match];

const allMatchesInProgress = [match2];

const matches = [match, match2];

export {
  match,
  matches,
  match2,
  allMatchesInProgress,
  allMatchesNotInProgress,
  match2FromDB,
  match1FromDB,
  match2Updated,
  returnedCreatedMatch,
}