const chaiHttp = require('chai-http')
    , server = require('./server/app/app.js')
    , agent = chai.request(server);

const user1 = { name: 'Peter', email: 'peter@ya.ru', password: 'secret' }
    , user2 = { name: 'Tom', email: 'tom@ya.ru', password: 'secret' }

const votation1 = {
    title: 'Peter`s votation',
    description: 'Some text of votation description'
  },
  votation2 = {
    title: 'Tom`s votation',
    description: 'Some text of votation description'
  };

const vote1 = { value: '1' }, vote2 = { value: '2' };

function post(path, data) {
  return agent
  .post(path)
  .send(data)
  .end((err, res) => {
    const body = JSON.parse(res.body);    
    Promise.resolve(body);
  });
}

function get(path, query) {
  return agent
  .get(path)
  .end((err, res) => {
    const body = JSON.parse(res.body);    
    Promise.resolve(body);
  });
}

(function(){
  let user1Id, user2Id, votation1Id, votation2Id
  
  post('/register', user1)
  .then(res => { user1Id = res.userId; return Promise.resolve(); })
  .then(() => post('/register', user2))
  .then(res => { user2Id = res.userId; return Promise.resolve(); })
  
  .then(() => post('/login', user1Id))
  .then(() => post('/votations', {
    votationData: {
      title: votation1.title,
      description: votation1.description,
      creatorId: user1Id
    },
    votes: [
      { value: vote1.value, creatorId: user1Id },
      { value: vote2.value, creatorId: user2Id }
    ]
  }))
  .then(() => get('/logout'))

  
})()


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
      creatorId: userId2
    },
    votes : [
      { value: '1', creatorId: userId },
      { value: '2', creatorId: userId2 }
    ]
  })
  .end((err, res) => {
    agent
    .get('/votations?limit=10&offset=0')
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