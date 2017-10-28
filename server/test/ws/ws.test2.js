'use strict';

const chai = require('chai')
    , io = require('socket.io-client')
    , expect = chai.expect
    , flush = require('../../app/cache').flush;

describe('websocket server', () => {
  const 
  votation1 = { title: 'test title', description: 'test desc', creator_id: '1' },
  user1 = { name: 'user1', id: '1' },
  user2 = { name: 'user2', id: '2' },
  vote1 = { value: '1', creatorId: '1' },
  vote2 = { value: '2', creatorId: '2' };

  describe('votations namespace', () => {
    after((done) => {
      flush().then(done);
    });

    it('should CREATE_VOTATION', (done) => {
      const client1 = io.connect(
        'http://localhost:3001/votations',
        { transports: ['websocket'] });

      client1.on('connect', () => {
        client1.emit('CREATE_VOTATION', votation1);

        client1.on('VOTATION_CREATED', (id) => {
          expect(id).to.be.a('number');
          client1.disconnect();
          done();
        });
      });
    });
  });

  describe('votationRoom namespace', () => {
    let votationId, creatorId, client1, client2;
    
    beforeEach((done) => {
      const creator = io.connect(
        'http://localhost:3001/votations?id=' + user1.id,
        { transports: ['websocket'] });
      creator.on('connect', () => {
        creator.emit('CREATE_VOTATION', votation1);

        creator.on('VOTATION_CREATED', (id) => {
          votationId = id;
          creatorId = user1.id;
          creator.disconnect();

          client1 = io.connect(
            'http://localhost:3001/votationRoom',
            { 
              transports: ['websocket'],
              // 'force new connection': true
            });
    
          client2 = io.connect(
            'http://localhost:3001/votationRoom',
            { 
              transports: ['websocket'],
              // 'force new connection': true 
            });

          done();
        });
      });
    });

    it('should UPDATE_PARTICIPANTS after joininig votation '
    + 'room', (done) => {      
      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id, creatorId });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id, creatorId });
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
      const client3 = io(
        'http://localhost:3001/votations?id=' + user2.id,
        { 
          transports: ['websocket'],
          'force new connection': true 
        });
      
      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id, creatorId });
        client1.emit('INVITE', { 
          creatorId: user1.id,
          votationId,
          title: votation1.title,
          description: votation1.description,
          users: ['2'] //user id to invite
        });
      });
  
      client3.on('connect', () => {
        client3.emit('join', { votationId, userId: user2.id });
      });
      
      client3.on('INVITE_USER', (data) => {
        expect(data.creatorId).to.equal(creatorId);
        expect(data.user).to.equal('2');
        client1.disconnect();
        client2.disconnect();
        client3.disconnect();
        done();
      });
    });

    it('should trigger REMOVE_USER after disconnect', (done) => {
      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id, creatorId });
        
        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id, creatorId });
          client2.disconnect();
        });
      });
      client1.on('REMOVE_USER', (userId) => {
        expect(userId).to.be.equal(user2.id);
        client1.disconnect();
        done();
      });
    });

    it('should SEND_VOTE to room creator', (done) => {
      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id, creatorId });
        
        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id, creatorId });
          client2.emit('SEND_VOTE', { voteData: vote2, votationId });
        });
      });
      client1.on('ADD_VOTE', (data) => {
        expect(data).to.deep.equal(vote2);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });

    it('should SAVE_VOTATION', (done) => {
      client1.on('connect', () => {
        client1.emit('join', { votationId, userId: user1.id, creatorId });
        client1.emit('SEND_VOTE', { 
          voteData: {
            value: vote1.value,
            creator_id: vote1.creatorId
          }, votationId });

        client2.on('connect', () => {
          client2.emit('join', { votationId, userId: user2.id, creatorId });
          client2.emit('SEND_VOTE', { 
          voteData: {
            value: vote2.value,
            creator_id: vote2.creatorId
          }, votationId });
          client1.emit('SAVE_VOTATION', votation1);
        });
      });
      client1.on('CLOSE_VOTATION', (id) => {
        expect(id).to.eql(votationId);
        client1.disconnect();
        client2.disconnect();
        done();
      });
    });
  });
});