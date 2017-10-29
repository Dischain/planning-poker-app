'use strict';

const chai = require('chai')
    , db = require('../../../app/db')

    , modelNames = require('../../../app/model').modelNames
    , users = require('../../../app/model').getModel(modelNames.USERS_MODEL)
    , votations = require('../../../app/model').getModel(modelNames.VOTATIONS_MODEL)
    , votes = require('../../../app/model').getModel(modelNames.VOTES_MODEL)
    , userConstants = require('../../../app/model/users').constants
    , votationConstants = require('../../../app/model/votations').constants
    , votesConstants = require('../../../app/model/votes').constants
    , expect = chai.expect;

describe('votes', () => {
  const userData = {
    name: 'user',
    email: 'user@email.com',
    password: 'password'
  };

  let 
  userId, 
  votationId, 
  votationData = {
    title: 'this is default votation',
    description: 'this is default votation description',
  },
  voteData = {
    value: '8'
  };

  before((done) => {
    db.init()
    .then(() => done());
  });

  beforeEach((done) => {
    votes
    .query(votesConstants.CLEAR_TABLE)
    .then(() => users.query(userConstants.CLEAR_TABLE))
    .then(() => votes.query(votesConstants.CLEAR_TABLE))
    .then(() => users.query(userConstants.CREATE_USER, userData))
    .then((result) => {      
      userId = votationData.creatorId = voteData.creatorId = result.insertId;
      return Promise.resolve(votationData);
    })
    .then((data)=> votations.query(votationConstants.CREATE_VOTATION, data))
    .then((result) => {
      votationId = voteData.votationId = result.insertId;
      return Promise.resolve(voteData);
    })
    .then(() => done());
  });

  after((done) => {
    db.closeConnection().then(() => done());
  });

  describe('CREATE_VOTE', () => {
    it('should create vote', (done) => {
      votes.query(votesConstants.CREATE_VOTE, voteData)
      .then((result) => {
        expect(result.affectedRows).to.equal(1);
        expect(result.serverStatus).to.equal(2);
        done();
      });
    });
  });

  describe('GET_VOTES_BY_VOTATION_ID', () => {
    it('should get votes by corresponding votationId', (done) => {
      votes.query(votesConstants.CREATE_VOTE, voteData)
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: '2',
        creatorId: voteData.creatorId,
        votationId: voteData.votationId
      }))
      .then(() => votes.query(votesConstants.GET_VOTES_BY_VOTATION_ID, {votationId: votationId}))
      .then((result) => {
        expect(result.length).to.equal(2);
        expect(result[0].value).to.equal('8');
        expect(result[1].value).to.equal('2');
        done();
      });
    });
  });

  describe('CLEAR_TABLE', () => {
    it('should clear table', (done) => {
      votes.query(votesConstants.CREATE_VOTE, voteData)
      .then(() => votes.query(votesConstants.CLEAR_TABLE))
      .then(() => votes.query(votesConstants.GET_ALL))
      .then((result) => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  describe('DROP_TABLE', () => {
    it('should drop table', (done) => {
      votes.query(votesConstants.DROP_TABLE)
      .then(() => {        
        votes.query(votesConstants.GET_ALL).catch((err) => {
          expect(err.message).to.contains('ER_NO_SUCH_TABLE');
          done();
        });
      });
    });
  });
});