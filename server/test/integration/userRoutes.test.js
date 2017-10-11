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
        server.get('/users')
        .send({ limit: 10, offset: 0 })
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
  });
});