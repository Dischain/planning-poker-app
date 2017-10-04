'use strict';

const chai = require('chai');
const db = require('../../../app/db');
const users = require('../../../app/model/users');

const expect = chai.expect;

describe('users', () => {
  const userData = {
    name: 'user',
    email: 'user@email.com',
    password: 'password'
  };


  before((done) => {
    db.init()
    //.then(() => users.dropTable())
    .then(() => done());
  });

  beforeEach((done) => {
    users.clear().then(() => done());
  });

  after((done) => {
    db.closeConnection().then(() => done());
  });

  describe('create', () => {
    it ('should create user', (done) => {      
      users.create(userData)
      .then((result) => { 
        expect(result.affectedRows).to.equal(1);
        expect(result.serverStatus).to.equal(2);
        done();
      })
      .catch(console.log);
    });
  });

  describe('getAll', () => {
    it ('should find all users', (done) => {            
      let userPromises = [];

      for (let i = 0; i <= 2; i++) {
        userPromises.push(users.create({
          name: userData.name + i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises).then(() => {
        users.getAll().then((result) => {
          expect(result.length).to.equal(3);
          done();
        });
      });
    });
  });

  describe('getAllLimitedFromOffset', () => {
    it ('should get all users in limit from ofset', (done) => {
      let userPromises = [];
      
      for (let i = 0; i <= 9; i++) {
        userPromises.push(users.create({
          name: i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises).then(() => {
        users.getAllLimitedFromOffset(3, 5).then((result) => {
          expect(result.length).to.equal(3);
          done();
        });
      });
    });
  });
});