'use strict';

const chai = require('chai')
    , db = require('../../../app/db')

    , modelNames = require('../../../app/model').modelNames
    , users = require('../../../app/model').getModel(modelNames.USERS_MODEL)
    , votations = require('../../../app/model').getModel(modelNames.VOTATIONS_MODEL)
    , userConstants = require('../../../app/model/users').constants
    , votationConstants = require('../../../app/model/votations').constants
    , expect = chai.expect;

describe('votations model', () => {
  const userData = {
    name: 'user',
    email: 'user@email.com',
    password: 'password'
  };

  let userId, votationData = {
    title: 'this is default votation',
    description: 'this is default votation description',
  };

  let votationsSet = [
    {
      title: 'my first votation',
      description: 'my first uber votation',
    },
    {
      title: 'this is my second vottn',
      description: 'i like to make mistakes in votation titles'
    },
    {
      title: 'should we stop creating spagetti code?',
      description: 'it`s a bit complicated qtion'
    },
    {
      title: 'should we stop creating spagetti code, vol 2',
      description: 'tldr: no'
    }
  ];

  before((done) => {
    db.init()
    .then(() => done());
  });

  beforeEach((done) => {
    votations
    .query(votationConstants.CLEAR_TABLE)
    .then(() => users.query(userConstants.CLEAR_TABLE))
    .then(() => users.query(userConstants.CREATE_USER, userData))
    .then((result) => {      
      userId = votationData.creator_id = result.insertId;
      return Promise.resolve(/*votationData*/);
    })
    //.then((data)=> votations.query(votationConstants.CREATE_VOTATION, data))
    .then(() => done());
  });

  after((done) => {
    db.closeConnection().then(() => done());
  });

  describe('CREATE_VOTATION', () => {
    it('should create votation', (done) => {
      votations.query(votationConstants.CREATE_VOTATION, votationData)
      .then((result) => {
        expect(result.affectedRows).to.equal(1);
        expect(result.serverStatus).to.equal(2);
        done();
      });
    });
  });

  describe('GET_ALL', () => {
    it('should get all votations', (done) => {
      votations.query(votationConstants.CREATE_VOTATION, votationData)
      .then(() => votations.query(votationConstants.GET_ALL))
      .then((result) => {
        expect(result.length).to.equal(1);
        done();
      });
    });
  });

  describe('GET_VOTATION_BY_ID', () => {
    it('should get votation by id', (done) => {
      votations.query(votationConstants.CREATE_VOTATION, votationData)
      .then((result) => Promise.resolve(result.insertId))
      .then((votationId) => votations.query(votationConstants.GET_VOTATION_BY_ID, { id: votationId }))
      .then((result) => {
        expect(result[0].title).to.equal(votationData.title);
        done();
      });
    });
  });

  describe('GET_ALL_LIMITED_BY_OFFSET', () => {
    it('should get all votations limited and with offset', (done) => {
      let votationPromises = [];
      
      for (let i = 0; i <= 10; i++) {
        votationPromises.push(votations.query(votationConstants.CREATE_VOTATION, {
          title: votationData.title + i,
          description: votationData.description,
          creator_id: votationData.creator_id
        }));
      }

      Promise.all(votationPromises).then(() => {
        votations.query(votationConstants.GET_ALL_LIMITED_FROM_OFFSET, { limit: 5, offset: 2})
        .then((result) => {
          expect(result.length).to.equal(5);
          done();
        });
      });
    });
  });

  describe('FIND_VOTATIONS_LIMITED_FROM_OFFSET', () => {
    beforeEach((done) => {
      votationsSet.forEach((votation) => votation.creator_id = userId );

      Promise.all(votationsSet.map((votation) => 
        votations.query(votationConstants.CREATE_VOTATION, votation)
      ))
      .then(() => done());
    });

    it('should find all votations against combined full text search by title, limited and with offset', (done) => {
      votations.query(votationConstants.FIND_VOTATIONS_LIMITED_FROM_OFFSET, { 
        text:  'vottn', limit: 10, offset: 0 })
      .then((result) => {
        expect(result[0].title).to.equal('this is my second vottn');
        done();
      });
    });

    it('should find all votations against combined full text search by description, limited and with offset', (done) => {
      votations.query(votationConstants.FIND_VOTATIONS_LIMITED_FROM_OFFSET, { 
        text:  'tldr', limit: 10, offset: 0 })
      .then((result) => {
        expect(result[0].description).to.equal('tldr: no');
        done();
      });
    });
  });

  describe('GET_USER_VOTATIONS_LIMITED_FROM_OFFSET', () => {
    beforeEach((done) => {
      votationsSet.forEach((votation) => votation.creator_id = userId );

      Promise.all(votationsSet.map((votation) => 
        votations.query(votationConstants.CREATE_VOTATION, votation)
      ))
      .then(() => done());
    });

    it('should find all user votations, limited and with offset', (done) => {
      votations.query(votationConstants.GET_USER_VOTATIONS_LIMITED_FROM_OFFSET, {
        creatorId: userId,
        limit: 2,
        offset: 1
      })
      .then((result) => {
        console.log(userId);
        console.log(result);
        expect(result[0].title).to.equal('this is my second vottn');
        expect(result[1].title).to.equal('should we stop creating spagetti code?');
        done();
      });
    });
  });

  describe('DELETE_VOTATION_BY_ID', () => {
    it('should delete votation by it id', () => {

    });

    it('should delete votation by it id and all corresponding votes', () => {

    });
  })
});