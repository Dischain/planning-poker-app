'use strict';

const chai = require('chai')
    , io = require('socket.io-client')
    , expect = chai.expect;
  
describe('websocket server', () => {
  // before((done) => {
  //   require('../../../app/app.js'); done();
  // });

  describe('votations namespace', () => {
    const votation1 = {
      title: 'test title',
      description: 'test desc',
      creator_id: '1'
    };

    it('should create votation', (done) => {
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
    // before:
    // 1. Создать объект голосования и поместить его в редис
    // 2. Создать объект юзера
    it('should update list of participants after joininig votation room', (done) => {

    });
  });
});