import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import Server from '../server';

describe('Examples', () => {
  it('should get all user', () =>
    request(Server)
      .get('/api/user')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should add a new example', () =>
    request(Server)
      .post('/api/user')
      .send({ name: 'test' })
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('test');
      }));

  it('should get an example by id', () =>
    request(Server)
      .get('/api/user/2')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('test');
      }));
});
