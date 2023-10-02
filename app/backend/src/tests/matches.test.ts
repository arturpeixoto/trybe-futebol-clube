import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import { allMatchesInProgress, allMatchesNotInProgress, match, match1FromDB, match2, match2FromDB, match2Updated, matches, returnedCreatedMatch } from './mocks/matches.mock';
import SequelizeMatch from '../database/models/SequelizeMatch';
import JWT from '../utils/JWT';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { team, team2 } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Endpoint MATCHES - INTEGRAÇÃO', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('Deve retornar todas as partidas - status 200', async () => {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);
    const {status, body} = await chai.request(app).get('/matches');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  it('Deve retornar partida com id 1 corretamente - status 200', async function() {
    sinon.stub(SequelizeMatch, 'findOne').resolves(match as any);

    const { status, body } = await chai.request(app).get('/matches/1');

    expect(body).to.deep.equal(match);
    expect(status).to.equal(200);
  });

  it('Deve retornar not found se não encontrar a partida - status 404', async function() {
    sinon.stub(SequelizeMatch, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/matches/1');

    expect(status).to.equal(404);
    expect(body.message).to.deep.equal('Match 1 not found');
  });

  it('Deve retornar partida com inProgress verdadeiro - status 200', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(allMatchesInProgress as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(allMatchesInProgress);
  });

  it('Deve retornar partida com inProgress falso - status 200', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(allMatchesNotInProgress as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=false');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(allMatchesNotInProgress);
  });

  it('Deve retornar erro com inProgress invalido - status 400', async function() {
    const { status, body } = await chai.request(app).get('/matches?inProgress=xablau');

    expect(status).to.equal(400);
    expect(body).to.deep.equal({message: 'BADREQUEST'});
  });

  it('Deve terminar a partida 2 com sucesso - status 200', async function() {
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match2FromDB as any).returnsThis();
    sinon.stub(SequelizeMatch, 'update').resolves();

    const { status, body } = await chai.request(app)
      .patch('/matches/2/finish')
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Finished'});
    expect(status).to.equal(200);
  });

  it('Deve retornar erro se não encontrar partida ao tentar terminar - status 404', async function() {
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app)
      .patch('/matches/2/finish')
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Match with id 2 not found.'});
    expect(status).to.equal(404);
  });

  it('Deve retornar erro se partida já terminou ao tentar terminar - status 400', async function() {
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match1FromDB as any);

    const { status, body } = await chai.request(app)
      .patch('/matches/2/finish')
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Match with id 2 already finished.'});
    expect(status).to.equal(400);
  });

  it('Deve atualizar a partida 2 com sucesso - status 200', async function() {
    const reqBody = {
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match2 as any).returnsThis();
    sinon.stub(SequelizeMatch, 'update').resolves();

    const { status, body } = await chai.request(app)
      .patch('/matches/2')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Updated'});
    expect(status).to.equal(200);
  });

  it('Deve retornar erro se não encontrar a partida ao tentar atualizar - status 404', async function() {
    const reqBody = {
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app)
      .patch('/matches/2')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Match with id 2 not found.'});
    expect(status).to.equal(404);
  });

  it('Deve retornar erro se partida já terminou ao tentar atualizar - status 400', async function() {
    const reqBody = {
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match1FromDB as any);

    const { status, body } = await chai.request(app)
      .patch('/matches/2')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Match with id 2 already finished.'});
    expect(status).to.equal(400);
  });

  it('Deve retornar erro ao tentar atualizar partida, gol em string - status 422', async function() {
    const reqBody = {
      "homeTeamGoals": 'três',
      "awayTeamGoals": 1
    }
    sinon.stub(JWT, 'verify').resolves('validToken');

    const { status, body } = await chai.request(app)
      .patch('/matches/2')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Invalid data'});
    expect(status).to.equal(422);
  });

  it('Deve criar partida com sucesso - status 200', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: 0,
    }
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeTeam, 'findByPk').onFirstCall().resolves(team as any).onSecondCall().resolves(team2 as any);
    sinon.stub(SequelizeMatch, 'create').resolves(returnedCreatedMatch as any);

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal(returnedCreatedMatch);
    expect(status).to.equal(201);
  });

  it('Deve retornar erro se não encontrar algum dos times - status 404', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2342,
      awayTeamGoals: 0,
    }
    sinon.stub(JWT, 'verify').resolves('validToken');
    sinon.stub(SequelizeTeam, 'findByPk').onFirstCall().resolves(team as any).onSecondCall().resolves(null);

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'There is no team with such id!'});
    expect(status).to.equal(404);
  });

  it('Deve retornar erro ao tentar criar partida, sem algum dos campos - status 422', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
    }
    sinon.stub(JWT, 'verify').resolves('validToken');

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Invalid data'});
    expect(status).to.equal(422);
  });

  it('Deve retornar erro ao tentar criar partida, campo goals em string - status 422', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: '3'
    }
    sinon.stub(JWT, 'verify').resolves('validToken');

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Invalid data'});
    expect(status).to.equal(422);
  });

  it('Deve retornar erro ao tentar criar partida, campo id em string - status 422', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: '2',
      awayTeamGoals: 0
    }
    sinon.stub(JWT, 'verify').resolves('validToken');

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'Invalid data'});
    expect(status).to.equal(422);
  });

  it('Deve retornar erro ao tentar criar partida, times iguais - status 422', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 1,
      awayTeamGoals: 0
    }
    sinon.stub(JWT, 'verify').resolves('validToken');

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `validToken`);

    expect(body).to.deep.equal({message: 'It is not possible to create a match with two equal teams'});
    expect(status).to.equal(422);
  });

  it('Deve retornar erro ao tentar criar partida, sem token - status 401', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: '3'
    }

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody);

    expect(body).to.deep.equal({message: 'Token not found'});
    expect(status).to.equal(401);
  });

  it('Deve retornar erro ao tentar criar partida, token inválido - status 401', async function() {
    const reqBody = {
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: '3'
    }

    const { status, body } = await chai.request(app)
      .post('/matches')
      .send(reqBody)
      .set('authorization', `invalidToken`);

    expect(body).to.deep.equal({message: 'Token must be a valid token'});
    expect(status).to.equal(401);
  });

  afterEach(sinon.restore);
});
