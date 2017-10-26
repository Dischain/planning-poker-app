'use strict';

const httpServer = require('http').Server
  , ws = require('socket.io')
  , Server = require('http').Server

  , modelNames = require('../model').modelNames
  , votations = require('../model').getModel(modelNames.VOTATIONS_MODEL)
  , votationsConstants = require('../model/votations').constants
  , users = require('../model').getModel(modelNames.USERS_MODEL)
  , userConstants = require('../model/users').constants
  , votes = require('../model').getModel(modelNames.VOTES_MODEL)
  , votesConstants = require('../model/votes').constants

  , cache = require('../cache').votationCache

  , assign = Object.assign;

  function ioEvents(io) {
    io.on('connection', (socket) => {
      // обновить список юзеров онлайн
      // поместить в кеш, что юзер онлайн
    });
    io.on('disconnect', (socket) => {
      // обновить список юзеров онлайн
      // поместить в кеш, что юзер офлайн
    });
    io.of('/votations').on('connection', (socket) => {
      socket.on('CREATE_VOTATION', (votationData) => {
        votations.query(votationsConstants.CREATE_VOTATION, votationData)
        .then(({ insertId }) => {
          // сохранить id временного голосования
          cache.storeVotation(assign({}, votationData, { id: insertId }))
          .then(() => {
            // оповестить создателя об успешном создании комнаты
            socket.emit('VOTATION_CREATED', insertId);
          })
          .catch((err) => {
            socket.emit('VOTATION_CREATATION_ERROR');
          })        
        })
        .catch((err) => {
          socket.emit('VOTATION_CREATATION_ERROR');
        });
      });
    });
  
    io.of('/votationRoom').on('connection', (socket) => {
      socket.on('join', ({ votationId, userId }) => {
        console.log('triggered join');
        cache.storeUserByVotation(votationId, userId)
        .then(() => {
          // присоединяем его к комнате
          return new Promise((resolve, reject) => {
            socket.join(votationId, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        })
        // вытаскиваем всех пользователей, зашедших в эту комнату, из кеша
        .then(() => cache.getUsersByVotation(votationId))
        // обновляем список участников голосования
        .then((users) => {
          socket.to(votationId).broadcast.emit('UPDATE_PARTICIPANTS', users)
        })
        .catch((err) => {
          if (err.message === 'VOTATION_NOT_EXISTS')
            socket.emit('VOTATION_CONNECTION_ERROR');
        });
      });
  
      socket.on('disconnect', (userId, votationId) => {
        console.log('server start triggering disconnect');
        cache.removeUserFromVotation(userId, votationId)
        .then(() => {
          // покидаем комнату с таким votationId
          return new Promise((resolve, reject) => {
            socket.leave(votationId, (err) => {
              console.log('start leaving room...');
              if (err) return reject(err);
              console.log('leaved successfully');
              resolve();
            });
          });
        })
        .then(() => {
          // оповещаем остальных, что usesrId их покинул
          console.log(userId);
          socket.to(votationId).emit('REMOVE_USER', userId);
        })
        .catch((err) => {
          console.log(err);
          socket.emit('VOTATION_DISCONNECTION_ERROR');
        });
      });
  
      socket.on('invite', ({ creatorId, votationId, title, description, users }) => {
        // высылаем голосование от имени создателя, с указанием инфо и id голосования
        // указанным в массиве users пользователям
        users.forEach((user) => {
          socket.emit('INVITE_USER', { creatorId, votationId, title, description });
        });
      });
  
      // voteData должен иметь поле creatorId (своего id пока еще не имеет). Учесть это в cache.storeVote
      socket.on('send_vote', (voteData) => {
        // сохранить value в редис до завершения голосования
        cache.storeVote(voteData)
        // привяжем голос к голосованию
        .then(() => cache.storeVoteByVotation(vote.votationId, vote.creatorId))
        // посылает окончательный результат голосования на creatorId (можно отпр. только раз)
        .then(() => socket.to(voteData.votationId).emit('ADD_VOTE', voteData));
      });
  
      socket.on('save_votation', (votationData) => {
        // вытаскивает временные значения голосов из redis
        cache.getVotesByVotation(votationData.id)
        .then((votes) => {
        // и сохраняем готовое голосование с результатами в бд
          return votesData.reduce((initial, vote) => {
            vote.votation_id = votationData.id;
            return initial.then(() => votes.query(votesConstants.CREATE_VOTE, vote));
          }, Promise.resolve());
        })
        // затираем кеш
        .then(() => cache.removeVotation(votationData.id, Object.keys(votationData)))
        .then(() => cache.removeAllVotesByVotation(votationData.id)) // дописать
        .then(() => cache.removeAllUserFromVotation(votationData.id)) // дописать
        .then(() => {
        // закрываем комнату
          socket.broadcast.to(votationId).emit('CLOSE_VOTATION');          
        })
        .catch((err) => {          
          votations.query(votationsConstants.DELETE_VOTATION, votationData.id)
          .then(() => socket.emit('VOTATION_SAVING_ERROR'));       
        })
      });
    });
  }
  
  module.exports = (app) => {
    let server = Server(app)
      , io = ws(server);
  
    io.set('transports', ['websocket']);
  
    ioEvents(io);
  
    return server;
  }