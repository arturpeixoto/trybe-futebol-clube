import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { invalidEmailBody, invalidPasswordBody, invalidPasswordFromDb, noEmailBody, noPasswordBody, validAdminReturnFromVerify, validLoginBody, validUserFromDb, validUserReturnFromVerify } from './mocks/users.mock';
import SequelizeUser from '../database/models/SequelizeUser';
import JWT from '../utils/JWT';

chai.use(chaiHttp);

const { expect } = chai;

const invalidEmailOrPasswordString = 'Invalid email or password';

describe('Endpoint USERS/LOGIN - INTEGRAÇÃO', () => {
  it('Deve retornar erro - sem email no body - 400', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(noEmailBody);

      expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    expect(status).to.equal(400);
  });

  it('Deve retornar erro - sem senha no body - 400', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(noPasswordBody);

    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Deve retornar erro - formato email invalido - 401', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(invalidEmailBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: invalidEmailOrPasswordString });
  });

  it('Deve retornar erro - senha menor que 6 caracteres - 401', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(invalidPasswordBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: invalidEmailOrPasswordString });
  });

  it('Deve retornar erro - não encontrou o usuário - 401', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);
    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: invalidEmailOrPasswordString });
  });

  it('Deve retornar erro - senhas não batem - 401', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(invalidPasswordFromDb as any);

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);
    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: invalidEmailOrPasswordString });
  });

  it('Deve retornar token - sucesso de login - 200', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(validUserFromDb as any);
    sinon.stub(JWT, 'sign').resolves('validToken');

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);
    expect(status).to.equal(200);
    expect(body).to.have.key('token');
  });

  it('Deve retornar role admin - 200', async function() {
    sinon.stub(JWT, 'verify').resolves(validAdminReturnFromVerify);

    const { status, body } = await chai.request(app)
      .get('/login/role')
      .set('authorization', `Bearer validToken`);
    expect(status).to.equal(200);
    expect(body).to.have.key('role');
    expect(body.role).to.be.deep.equal('admin');
  });

  it('Deve retornar role user - 200', async function() {
    sinon.stub(JWT, 'verify').resolves(validUserReturnFromVerify);

    const { status, body } = await chai.request(app)
      .get('/login/role')
      .set('authorization', `Bearer validToken`);
    expect(status).to.equal(200);
    expect(body).to.have.key('role');
    expect(body.role).to.be.deep.equal('user');
  });

  afterEach(() => sinon.restore())
})