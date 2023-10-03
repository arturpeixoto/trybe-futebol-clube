import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeMatch from '../database/models/SequelizeMatch';

import { 
  leaderboardAway,
  leaderboardHome,
  leaderboardTotal,
  matchesLeaderboard, teamsLeaderboard,
} from './mocks/leaderboard.mock'
import SequelizeTeam from '../database/models/SequelizeTeam';

chai.use(chaiHttp);

const { expect } = chai;

describe('Endpoint LEADERBOARD - INTEGRAÇÃO', () => {
  it('Deve retornar o leaderboard de mandantes - status 200', async () => {
    sinon.stub(SequelizeMatch, 'findAll').withArgs().resolves(matchesLeaderboard as any);
    sinon.stub(SequelizeTeam, 'findAll').resolves(teamsLeaderboard as any);

    const { status, body } = await chai.request(app).get('/leaderboard/home');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardHome);
  });

  it('Deve retornar o leaderboard de visitantes - status 200', async () => {
    sinon.stub(SequelizeMatch, 'findAll').withArgs().resolves(matchesLeaderboard as any);
    sinon.stub(SequelizeTeam, 'findAll').resolves(teamsLeaderboard as any);

    const { status, body } = await chai.request(app).get('/leaderboard/away');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardAway);
  });

  it('Deve retornar o leaderboard total - status 200', async () => {
    sinon.stub(SequelizeMatch, 'findAll').withArgs().resolves(matchesLeaderboard as any);
    sinon.stub(SequelizeTeam, 'findAll').resolves(teamsLeaderboard as any);

    const { status, body } = await chai.request(app).get('/leaderboard');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboardTotal);
  });
  afterEach(() => sinon.restore())
});
