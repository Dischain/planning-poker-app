'use strict';

const chai = require('chai')
    , chaiHttp = require('chai-http')
    , server = require('../../app/app.js')

    , modelNames = require('../../app/model').modelNames
    , users = require('../../app/model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../../app/model/users').constants
    , expect = chai.expect
    , should = chai.should();

chai.use(chaiHttp);

describe('users routes', () => {
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

  before((done) => {
    users.query(userConstants.CLEAR_TABLE).then(() => done());
  });

  describe('register', () => {
    it('should register new user', (done) => {
      chai.request(server)
      .post('/register')
      .send(userData)
      .end((err, res) => {
        const body = JSON.parse(res.body);

        expect(body).to.haveOwnProperty('userId');
        res.should.have.status(201);
        
        userId = body.userId;

        done();
      });
    });

    it('should return user data for created user userId', (done) => {
      const userPath = '/users/' + userId;

      chai.request(server)
      .get(userPath)
      .end((err, res) => {
        const body = JSON.parse(res.body);

        res.should.have.status(200);
        expect(body.name).to.equal(userData.name);
        expect(body.email).to.equal(userData.email);
        expect(body.userId).to.equal(userId);
        done();
      });
    });
  });

  describe('get users', () => {
    it('should return all users limitied with offset', (done) => {
      users.query(userConstants.CLEAR_TABLE)
      .then(() => users.register(userData))
      .then((result) => {
        userId = result.insertId; 
        return Promise.resolve();
      })
      .then(() => users.register(userData2))
      .then((result) => {
        userId2 = result.insertId; 
        return Promise.resolve();
      })
      .then(() => chai.request(server))
      .then((server) => {
        server.get('/users?limit=10&offset=0')        
        .end((err, res) => {
          const body = JSON.parse(res.body);
  
          res.should.have.status(200);
          expect(body.users.length).to.equal(2);
          done();
        });
      });
    });

    it('should return user by id', (done) => {
      const userPath = '/users/' + userId;

      chai.request(server)
      .get(userPath)
      .end((err, res) => {
        const body = JSON.parse(res.body);
  
        res.should.have.status(200);
        expect(body.name).to.equal(userData.name);
        expect(body.email).to.equal(userData.email);
        expect(body.userId).to.equal(userId);
        done();
      });
    });

    it ('should find user by name using regex', (done) => {
      const searchQuery = '/users?user=user&limit=10&offset=0';

      let userPromises = [];
      
      for (let i = 0; i <= 100; i++) {
        userPromises.push(users.query(userConstants.CREATE_USER, {
          name: i + userData.name + i,
          email: userData.email + i,
          password: userData.password
        }));
      }

      Promise.all(userPromises)
      .then(() => {
        chai.request(server)
        .get(searchQuery)
        .end((err, res) => {
          const body = JSON.parse(res.body);

          res.should.have.status(200);
          expect(body.length).to.equal(10);
          done();
        })
      })
    });
  });

  describe('login', () => {
    before((done) => {
      users.query(userConstants.CLEAR_TABLE)
      .then(() => users.register(userData))
      .then(() => done());
    });

    it('should login user', (done) => {
      chai.request(server)
      .post('/login')
      .send(userData)
      .end((err, res) => {
        const body = JSON.parse(res.body);
        expect(body).to.haveOwnProperty('userId');
        res.should.have.status(200);        
        done();
      });
    });

    it('Should not login user with invalid email', (done) => {
      chai.request(server)
      .post('/login')
      .send({ email: 'invalid', password: 'invalid'})
      .end((err, res) => { 
        const body = JSON.parse(res.body);

        expect(body.message).to.equal('Incorrect email');
        res.should.have.status(400);
        done();
      });
    });

    it('Should not login user with invalid password', (done) => {
      chai.request(server)
      .post('/login')
      .send({ email: userData.email, password: 'invalid'})
      .end((err, res) => {
        const body = JSON.parse(res.body);

        expect(body.message).to.equal('Incorrect password');
        res.should.have.status(400);
        done();
      });
    });
  });
});