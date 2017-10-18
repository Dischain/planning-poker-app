'use strict';

const chai = require('chai')
    , chaiHttp = require('chai-http')
    , server = require('../../app/app.js')

    , modelNames = require('../../app/model').modelNames
    , users = require('../../app/model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../../app/model/users').constants
    , votations = require('../../app/model').getModel(modelNames.VOTATIONS_MODEL)
    , votationConstants = require('../../app/model/votations').constants
    , votes = require('../../app/model').getModel(modelNames.VOTES_MODEL)
    , votesConstants = require('../../app/model/votes').constants
    , expect = chai.expect
    , should = chai.should();

chai.use(chaiHttp);

describe('votation routes', () => {
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

  let userId, userId2;

  const votation = {
    title: 'my first votation',
    description: 'my first uber votation',
  },
  votation2 = {
    title: 'this is my second vottn',
    description: 'i like to make mistakes in votation titles'
  },
  votation3 = {
    title: 'should we stop creating spagetti code?',
    description: 'it`s a bit complicated qtion'
  };

  let votationId, votation2Id;

  before((done) => {
    votes.query(votesConstants.CLEAR_TABLE)
    .then(() => votations.query(votationConstants.CLEAR_TABLE))
    .then(() => users.query(userConstants.CLEAR_TABLE))        
    .then(() => done());
  });

  describe('post votation', () => {
    it('should create new votation with all corresponding votes', (done) => {
      const agent = chai.request.agent(server);

      users.register(userData)
      .then((result) => {
        userId = result.insertId;
        return Promise.resolve();
      })
      .then(() => users.register(userData2))      
      .then((result) => {
        userId2 = result.insertId;
        return Promise.resolve();
      })
      .then(() => {
        agent
        .post('/login')
        .send(userData)
        .end((err, res) => {
          agent
          .post('/votations')
          .send({
            votationData: {
              title: votation.title,
              description: votation.description,
              creator_id: userId
            },
            votes : [
              { value: '1', creator_id: userId },
              { value: '2', creator_id: userId2 }
            ]
          })
          .end((err, res) => {            
            const body = JSON.parse(res.body);
            votationId = body.votationId;

            res.should.have.status(201);
            expect(body).to.haveOwnProperty('votationId');
            done();
          });
        });
      });
    });
  });

  describe('get all votations limited with offset', () => {
    it('should get all votations limited with offset', (done) => {
      const agent = chai.request.agent(server);

      agent
      .post('/login')
      .send(userData)
      .end((err, res) => {
        agent
        .post('/votations')
        .send({ // posting second votation, first allready sent
          votationData: {
            title: votation2.title,
            description: votation2.description,
            creator_id: userId2
          },
          votes : [
            { value: '1', creator_id: userId },
            { value: '2', creator_id: userId2 }
          ]
        })
        .end((err, res) => {
          agent
          .get('/votations')
          .send({ limit: 10, offset: 0 })
          .end((err, res) => {
            const body = JSON.parse(res.body);
            
            expect(body.length).to.equal(2);
            expect(body[0]).to.haveOwnProperty('votationData');
            expect(body[0]).to.haveOwnProperty('votes');
            expect(body[1]).to.haveOwnProperty('votationData');
            expect(body[1]).to.haveOwnProperty('votes');
            done();
          });
        });
      });
    });
  });

  describe('get votation by id', () => {
    it('should get votation with corresponding votes and user data by id', (done) => {
      const agent = chai.request.agent(server);

      agent
      .post('/login')
      .send(userData)
      .end((err, res) => {
        agent
        .get('/votations/' + votationId)
        .end((err, res) => {
          const body = JSON.parse(res.body);

          expect(body).to.haveOwnProperty('votationData');
          expect(body).to.haveOwnProperty('votes');
          expect(body.votationData.title).to.equal(votation.title);
          expect(body.votationData.creatorId).to.equal(userId);
          expect(Number.parseInt(body.votationData.votationId)).to.equal(votationId);
          expect(body.votes.length).to.equal(2);
          done();
        });
      });
    });
  });

  describe('get votations by creator id', () => {
    it('should get votations by creator id limited with offset', (done) => {
      const agent = chai.request.agent(server);

      agent
      .post('/login')
      .send(userData)
      .end((err, res) => {
        agent
        .get('/votations_by_user/' + userId)
        .send({ limit: 10, offset: 0 })
        .end((err, res) => {
          const body = JSON.parse(res.body);
          
          expect(body[0]).to.haveOwnProperty('votationData');
          expect(body[0]).to.haveOwnProperty('votes');
          expect(body[0].votationData.creatorId).to.equal(userId);
          done();
        });
      });
    });
  });

  describe('search for votations', () => {
    it('should find votations which contains supplied text inside it title or body '
     + 'limited and with offset', (done) => {

      const agent = chai.request.agent(server);
      
      // take in mind 50% rule...
      votations.query(votationConstants.CREATE_VOTATION, { 
        title: 'adasd', description: 'vvvv', creator_id: userId
      })
      .then(() => votations.query(votationConstants.CREATE_VOTATION, { 
        title: 'hjko', description: 'asss', creator_id: userId
      }))
      .then(() => votations.query(votationConstants.CREATE_VOTATION, { 
        title: 'hjko', description: 'asss', creator_id: userId
      }))
      .then(() => votations.query(votationConstants.CREATE_VOTATION, { 
        title: 'hjko', description: 'asss', creator_id: userId
      }))
      .then(() => {
        agent
        .post('/login')
        .send(userData)
        .end((err, res) => {
          agent
          .get('/votations_search')
          .send({ text: 'uber', limit: 10, offset: 0 })
          .end((err, res) => {
            const body = JSON.parse(res.body);

            expect(body[0]).to.haveOwnProperty('votationData');
            expect(body[0]).to.haveOwnProperty('votes');
            expect(body[0].votationData.title).to.equal('my first votation');
            expect(body[0].votationData.description).to.contain('uber');
            done();
          });
        });        
      });
    });
  });
});