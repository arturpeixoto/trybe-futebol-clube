import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';

import { Response } from 'superagent';
import { team, teams } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Endpoint TEAMS - INTEGRAÇÃO', () => {
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

  it('Deve retornar todos os times - status 200', async () => {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);
    const {status, body} = await chai.request(app).get('/teams');
    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('Deve retornar o time com id 1 corretamente - status 200', async function() {
    sinon.stub(SequelizeTeam, 'findOne').resolves(team as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(body).to.deep.equal(team);
    expect(status).to.equal(200);
  });

  it('Deve retornar not found se não encontrar o time - status 404', async function() {
    sinon.stub(SequelizeTeam, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body.message).to.deep.equal('Team 1 not found');
  });

  afterEach(sinon.restore);
});
