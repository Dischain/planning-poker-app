'use strict';

const chai = require('chai')
    , io = require('socket.io-client')
    , expect = chai.expect
    , flush = require('../../app/cache').flush;
  
describe('websocket server', () => {
  describe('votations namespace', () => {
    const votation1 = {
      title: 'test title',
      description: 'test desc',
      creator_id: '1'
    };

    it('should CREATE_VOTATION', (done) => {
      const client1 = io.connect(
        'http://localhost:3001/votations',
        { transports: ['websocket'] });

      client1.on('connect', () => {
        client1.emit('CREATE_VOTATION', votation1);

        client1.on('VOTATION_CREATED', (votationId) => {
          expect(votationId).to.be.a('number');
          done();
        });
      });
    });
  });

  describe('votationRoom namespace', () => {
    const 
    votation1 = {
      title: 'test title',
      description: 'test desc',
      creator_id: '1'
    },
    user1 = {
      name: 'user1',
      id: '1'
    }, 
    user2 = {
      name: 'user2',
      id: '2'
    };
    let client1, client2, votationId;

    before((done) => {
      client1 = io.connect(
        'http://localhost:3001/votations?id=' + user1.id,
        { transports: ['websocket'] });
      client1.on('connect', () => {
        client1.emit('CREATE_VOTATION', votation1);

        client1.on('VOTATION_CREATED', (id) => {
          votationId = id;
          client1.disconnect();
          done();
        });
      });
    });

    after((done) => {
      flush().then(done);
    });

    /*it('should UPDATE_PARTICIPANTS after joininig votation '
    + 'room', (done) => {       
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
        });           
      });
      client1.on('UPDATE_PARTICIPANTS', (users) => {
        expect(users.length).to.be.equal(2);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });

    it('should INVITE user', (done) => {
      client1 = io(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      
      client2 = io(
        'http://localhost:3001/votations?id=' + user2.id,
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });
        client1.emit('INVITE', { 
          creatorId: user1.id,
          votationId,
          title: votation1.title,
          description: votation1.description,
          users: [2]
        });
      });
      client2.on('connect', () => {
        client2.emit('join', { votationId, userId: user2.id });
      });
      
      client2.on('INVITE_USER', (data) => {
        console.log(data); console.log(votation1);
        //expect(data).to.deep.eql(votation1)
        client1.disconnect();
        client2.disconnect();
        done();
      })
    });

    it('should trigger REMOVE_USER after disconnect', (done) => {
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
          client2.disconnect();
        });           
      });
      client1.on('REMOVE_USER', (userId) => {
        expect(userId).to.be.equal(user2.id);
        client1.disconnect();
        done();
      });
    });*/

    it('should SEND_VOTE to room creator', (done) => {
      client1 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client2 = io.connect(
        'http://localhost:3001/votationRoom',
        { 
          transports: ['websocket'],
          'force new connection': true 
        });

      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id });
          client2.emit('SEND_VOTE', { value: '1', creatorId: '2', votationId});
        });           
      });

      client1.on('ADD_VOTE', (data) => {
        console.log(data);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });
  });
});