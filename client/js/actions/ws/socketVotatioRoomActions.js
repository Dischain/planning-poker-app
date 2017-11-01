'use strict';

import { 
  JOIN, 
  INVITE, 
  SEND_VOTE, 
  SAVE_VOTATION,

  UPDATE_PARTICIPANTS, 
  ADD_USER,
  REMOVE_USER,
  ADD_VOTE,
  CLOSE_VOTATION
} from '../../constants/socketVotationRoomConstants.js';

let useSocket = true, nsp = 'votationRoom';

// { votationId, userId, cretorId }
export function joinVotation(votationData) {
  return {
    useSocket,
    nsp, 
    type: JOIN, 
    promise: (socket) => socket.emit(JOIN, votationData)   
  };
}

export function inviteToVotation(data) {
  return {
    useSocket,
    nsp, 
    type: INVITE, 
    promise: (socket) => socket.emit(INVITE, votationData)   
  };
}

export function sendVote(data) {
  return {
    useSocket,
    nsp, 
    type: SEND_VOTE, 
    promise: (socket) => socket.emit(SEND_VOTE, votationData)   
  };
}

export function saveVotation(data) {
  return {
    useSocket,
    nsp, 
    type: SAVE_VOTATION, 
    promise: (socket) => socket.emit(SAVE_VOTATION, votationData)   
  };
}

export function updateParticipants(users) {
  return { type: UPDATE_PARTICIPANTS, users };
}

export function enterVotation(data) {
  return { type: ADD_USER, data };
}

export function removeUser(userId) {
  return { type: REMOVE_USER, userId };
}

export function addVote(data) {
  return { type: ADD_VOTE, data };
}

export function closeVotation(id) {
  return {
    type: CLOSE_VOTATION, id };
}