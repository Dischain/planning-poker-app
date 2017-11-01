'use strict';

import SocketClient from './SocketClient.js';

import { 
  updateParticipants,
  enterVotation,
  removeUser,
  addVote,
  closeVotation
} from '../actions/ws/socketVotationRoomActions.js';

let socket = new SocketClient('/votationRoom');

socket.on('UPDATE_PARTICIPANTS', (users) => {
  socket.dispatch(updateParticipants(users));
});

socket.on('INVITE_USER', (data) => {
  socket.dispatch(enterVotation(data));
});

socket.on('REMOVE_USER', (userId) => {
  socket.dispatch(removeUser(userId));
});

socket.on('ADD_VOTE', (data) => {
  socket.dispatch(addVote(data));
});

socket.on('CLOSE_VOTATION', (id) => {
  socket.dispatch(closeVotation(id));
});