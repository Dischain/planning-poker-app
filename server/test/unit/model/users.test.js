'use strict';

const chai = require('chai')
    , db = require('../../../app/db')

    , modelNames = require('../../../app/model').modelNames
    , users = require('../../../app/model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../../../app/model/users').constants
    , expect = chai.expect;

describe('users model', () => {
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
    users.query(userConstants.CLEAR_TABLE).then(() => done());
  });

  after((done) => {
    db.closeConnection().then(() => done());
  });

  describe('CREATE_USER', () => {
    it('should create user', (done) => {      
      users.query(userConstants.CREATE_USER, userData)
      .then((result) => { 
        expect(result.affectedRows).to.equal(1);
        expect(result.serverStatus).to.equal(2);
        done();
      })
      .catch(console.log);
    });
  });

  describe('GET_ALL', () => {
    it('should find all users', (done) => {            
      let userPromises = [];

      for (let i = 0; i <= 2; i++) {
        userPromises.push(users.query(userConstants.CREATE_USER, {
          name: userData.name + i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises).then(() => {
        users.query(userConstants.GET_ALL).then((result) => {
          expect(result.length).to.equal(3);
          done();
        });
      });
    });
  });

  describe('GET_USER_BY_ID', () => {
    it('should get user by id', (done) => {
      let insertId;

      users.query(userConstants.CREATE_USER, userData)
      .then((result) => insertId = result.insertId )
      .then((insertId) => users.query(userConstants.GET_USER_BY_ID, { id: insertId }))
      .then((result) => {
        expect(insertId).to.equal(result[0].id);
        done();
      });
    });
  });

  describe('GET_USER_BY_EMAIL', () => {
    it('should get user by email', (done) => {
      users.query(userConstants.CREATE_USER, userData)
      .then(() => users.query(userConstants.GET_USER_BY_EMAIL, { email: userData.email }))
      .then((result) => {
        expect(userData.email).to.equal(result[0].email);
        done();
      });
    });
  });

  describe('FIND_USERS_LIMITED_FROM_OFFSET', () => {
    it('should find user by name using full text index', (done) => {
      let userPromises = [];
      
      for (let i = 0; i <= 100; i++) {
        userPromises.push(users.query(userConstants.CREATE_USER, {
          name: i + userData.name + i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises).then(() => {
        users.query(userConstants.FIND_USERS_LIMITED_FROM_OFFSET, {
          name: 'user',
          limit: '1',
          offset: '0'
        }).then((result) => {
          console.log(result);
          done();
        });
      });
    });
  });

  describe('DELETE_USER_BY_ID', () => {
    it('should delete user by id', (done) => {
      let insertId;
      
      users.query(userConstants.CREATE_USER, userData)
      .then((result) => insertId = result.insertId )
      .then((insertId) => users.query(userConstants.DELETE_USER_BY_ID, { id: insertId }))
      .then(() => users.query(userConstants.GET_USER_BY_ID, { id: insertId }))
      .then((result) => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  describe('CLEAR_TABLE', () => {
    it('should clear table', (done) => {
      let userPromises = [];
      
      for (let i = 0; i <= 100; i++) {
        userPromises.push(users.query(userConstants.CREATE_USER, {
          name: i + userData.name + i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises).then(() => {
        users.query(userConstants.CLEAR_TABLE)
        .then(() => users.query(userConstants.GET_ALL))
        .then((result) => {
          expect(result.length).to.equal(0);
          done();
        });
      });
    });
  });

  describe('DROP_TABLE', () => {
    it('should drop table', (done) => {
      users.query(userConstants.DROP_TABLE)
      .then(() => users.query(userConstants.GET_ALL))
      .then((result) => { 
        expect(result.length).to.equal(0);
        done();
      });
    });
  });
});