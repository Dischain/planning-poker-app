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

describe('votations model', () => {
  const userData = {
    name: 'user',
    email: 'user@email.com',
    password: 'password'
  },
  userData2 = {
    name: 'user2',
    email: 'user2@email.com',
    password: 'password'
  };

  let userId, userId2, votationData = {
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
    .then(() => users.query(userConstants.CREATE_USER, userData2))
    .then((result) => {      
      userId2 = result.insertId;
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

  describe('GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET', () => {
    let votationId, votationId2,
        voteData = { value: '8' }, voteData2 = { value: '1' };

    it('should get all votations with corresponding votes and user data limited by offset', (done) => {
      votations.query(votationConstants.CREATE_VOTATION, {
        title: votationsSet[0].title,
        description: votationsSet[0].description,
        creator_id: userId
      })
      .then((result) => { 
        votationId = result.insertId;
        return Promise.resolve();
      })
      .then(() => 
        votations.query(votationConstants.CREATE_VOTATION, {
          title: votationsSet[1].title,
          description: votationsSet[1].description,
          creator_id: userId2
        })
      )
      .then((result) => { 
        votationId2 = result.insertId;
        return Promise.resolve();
      })
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData.value,
        votation_id: votationId,
        creator_id: userId
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData2.value,
        votation_id: votationId,
        creator_id: userId2
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData.value,
        votation_id: votationId2,
        creator_id: userId
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData2.value,
        votation_id: votationId2,
        creator_id: userId2
      }))
      .then(() => votations.query(votationConstants.GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET, {
        limit: 10, offset: 0
      }))
      .then((res) => {
        expect(res.length).to.equal(4);
        expect(res[0].title).to.equal(votationsSet[0].title);
        expect(res[0].description).to.equal(votationsSet[0].description);
        expect(res[0].userId).to.equal(userId);
        expect(res[0].votationId).to.equal(votationId);
        expect(res[0].name).to.equal(userData.name);
        expect(res[0].value).to.equal(voteData.value);
        done();
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
        expect(result.length).to.equal(2);
        done();
      });
    });
  });

  describe('GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET', () => {
    let votationId, votationId2,
        voteData = { value: '8' }, voteData2 = { value: '1' };

    it('should get all user votations with corresponding votes and user data limited by offset', (done) => {
      votations.query(votationConstants.CREATE_VOTATION, {
        title: votationsSet[0].title,
        description: votationsSet[0].description,
        creator_id: userId
      })
      .then((result) => { 
        votationId = result.insertId;
        return Promise.resolve();
      })
      .then(() => 
        votations.query(votationConstants.CREATE_VOTATION, {
          title: votationsSet[1].title,
          description: votationsSet[1].description,
          creator_id: userId2
        })
      )
      .then((result) => { 
        votationId2 = result.insertId;
        return Promise.resolve();
      })
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData.value,
        votation_id: votationId,
        creator_id: userId
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData2.value,
        votation_id: votationId,
        creator_id: userId2
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData.value,
        votation_id: votationId2,
        creator_id: userId
      }))
      .then(() => votes.query(votesConstants.CREATE_VOTE, {
        value: voteData2.value,
        votation_id: votationId2,
        creator_id: userId2
      }))
      .then(() => votations.query(votationConstants.GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET, {
        creatorId: userId, limit: 10, offset: 0
      }))
      .then((res) => {
        expect(res.length).to.equal(2);
        expect(res[0].creatorId).to.equal(userId);
        expect(res[1].creatorId).to.equal(userId);
        done();
      });
    });
  });

  describe('DELETE_VOTATION_BY_ID', () => {
    it('should delete votation by id', (done) => {
      let storedId;
      votations.query(votationConstants.CREATE_VOTATION, votationData)
      .then((result) => {
        storedId = result.insertId;
        return Promise.resolve(); 
      })
      .then(() => 
        votations.query(votationConstants.DELETE_VOTATION_BY_ID, {id: storedId}))
      .then(() => votations.query(votationConstants.GET_VOTATION_BY_ID, {id: storedId}))
      .then((result) => {
        expect(result.length).to.equal(0);
        done();
      });
    });

    it('should delete votation by id and all corresponding votes', (done) => {
      let 
      votationId,
      voteData = {
        value: '8'
      };

      votations.query(votationConstants.CREATE_VOTATION, votationData)
      .then((result) => {
        votationId = result.insertId;
        voteData.votation_id = votationId;
        voteData.creator_id = userId;
        return Promise.resolve(); 
      })
      .then(() => votes.query(votesConstants.CREATE_VOTE, voteData))
      .then(() => votations.query(votationConstants.DELETE_VOTATION_BY_ID, {id: votationId}))
      .then(() => votes.query(votesConstants.GET_VOTES_BY_VOTATION_ID, {votation_id: votationId}))
      .then((result) => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  describe('CLEAR_TABLE', () => {
    beforeEach((done) => {
      votationsSet.forEach((votation) => votation.creator_id = userId );

      Promise.all(votationsSet.map((votation) => 
        votations.query(votationConstants.CREATE_VOTATION, votation)
      ))
      .then(() => done());
    });

    it('should clear table', (done) => {
      votations.query(votationConstants.CLEAR_TABLE)
      .then(() => votations.query(votationConstants.GET_ALL))
      .then((result) => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  describe('DROP_TABLE', () => {
    it('should drop table', (done) => {
      votations.query(votationConstants.DROP_TABLE)
      .then(() => {        
        votations.query(votationConstants.GET_ALL).catch((err) => {
          expect(err.message).to.contains('ER_NO_SUCH_TABLE');
          done();
        });
      });
    });
  });
});