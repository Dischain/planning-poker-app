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
    let 
    // { userId: userSocket }
    votationsConnections = {}, 
    // { roomId: { userId: userSocket } }
    votationRoomsConnections = {},
    // { roomId: userSocket}
    votationRoomsCreators = {};

    io.on('connection', (socket) => {
      // update whether user online
    });
    io.on('disconnect', (socket) => {
      // update whether user offline
    });
    
    io.of('/votations').on('connection', (socket) => {
      if (socket.handshake.query.id) {
        let userConnId = socket.handshake.query.id;
        votationsConnections[userConnId] = socket;        
      }

      socket.on('CREATE_VOTATION', (votationData) => {
        votations.query(votationsConstants.CREATE_VOTATION, votationData)
        .then(({ insertId }) => {
          cache.storeVotation(assign({}, votationData, { id: insertId }))
          .then(() => {
            socket.emit('VOTATION_CREATED', insertId);
          })
          .catch((err) => {
            throw err;
          });
        })
        .catch((err) => {
          console.log(err);
          socket.emit('VOTATION_CREATION_ERROR');
        });
      });      
    });
  
    io.of('/votationRoom').on('connection', (socket) => {
      let connectionDetails = { userId: '', votationId: '' };
      socket.on('join', ({ votationId, userId, creatorId }) => {
        if (userId === creatorId) {
          votationRoomsCreators[votationId] = socket;
        }
        connectionDetails = { userId, votationId };

        cache.storeUserByVotation(votationId, userId)
        .then(() => {
          return new Promise((resolve, reject) => {
            socket.join(votationId, (err) => {
              if (err) return reject(err);

              socket.userId = userId;        
              socket.votationId = votationId;
              
              let temp = {}
              temp[userId] = socket;
              votationRoomsConnections[votationId] = temp;

              resolve();
            });
          });
        })
        .then(() => cache.getUsersByVotation(votationId))
        .then((users) => {
          socket.to(votationId).broadcast.emit('UPDATE_PARTICIPANTS', users)
        })
        .catch((err) => {
          console.log('in join');
          console.log(err);
          if (err.message === 'VOTATION_NOT_EXISTS')
            socket.emit('VOTATION_CONNECTION_ERROR');
        });
      });
  
      socket.on('disconnect', () => {        
        cache.removeUserFromVotation(connectionDetails.userId, connectionDetails.votationId)
        .then(() => {
          return new Promise((resolve, reject) => {
            socket.leave(connectionDetails.votationId, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        })
        .then(() => {          
          delete votationRoomsConnections[connectionDetails.votationId][connectionDetails.userId];
          socket.to(connectionDetails.votationId).emit('REMOVE_USER', connectionDetails.userId);
          connectionDetails = {};
        })
        .catch((err) => {
          console.log('in disconnect');
          console.log(err);
          socket.emit('VOTATION_DISCONNECTION_ERROR');
        });
      });
  
      socket.on('INVITE', ({ creatorId, votationId, title, description, users }) => {        
        users.forEach((user) => {
          votationsConnections[user].emit('INVITE_USER', { creatorId, votationId, title, description, user });
        });
      });
  
      socket.on('SEND_VOTE', ({ voteData, votationId }) => {
        cache.storeVote(voteData)
        .then(() => cache.storeVoteByVotation(votationId, voteData.creatorId))
        .then(() => votationRoomsCreators[votationId].emit('ADD_VOTE', voteData))
        .catch((err) => {
          console.log('in SEND_VOTE');
          console.log(err);
        });
      });
  
      socket.on('ABORT_VOTATION', () => {
        votations.query(votationsConstants.DELETE_VOTATION_BY_ID, socket.votationId)
        .then(() => cache.removeVotation(votationData.id, Object.keys(votationData)))
        .then(() => cache.removeAllVotesByVotation(votationData.id))
        .then(() => cache.removeAllUsersByVotation(votationData.id))
        .then(() => {
          delete votationRoomsConnections[votationId];
          delete votationRoomsCreators[votationId];

          socket.to(socket.votationId).emit('ABORTED');
        })
        .catch((err) => {
          console.log('in ABORT_VOTATION');
          console.log(err);
        });
      });

      socket.on('SAVE_VOTATION', (votationData) => {        
        const votationId = connectionDetails.votationId;

        cache.getVotesByVotation(votationId)
        .then((votesData) => {
          return votesData.reduce((initial, vote) => {
            vote.votationId = votationId;

            return initial.then(() => votes.query(votesConstants.CREATE_VOTE, vote));
          }, Promise.resolve());
        })
        .then(() => cache.removeVotation(votationId, Object.keys(votationData)))
        .then(() => cache.removeAllVotesByVotation(votationId))
        .then(() => cache.removeAllUsersByVotation(votationId))
        .then(() => {
          delete votationRoomsConnections[votationId];
          delete votationRoomsCreators[votationId];
          
          if (socket.userId === votationData.creatorId) {
            return socket.emit('CLOSE_VOTATION', votationId);
          }
          votationRoomsCreators[votationId].emit('CLOSE_VOTATION', votationId);          
        })
        .catch((err) => {
          console.log('in SAVE_VOTATION');
          console.log(err);
          votations.query(votationsConstants.DELETE_VOTATION, votationId)
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