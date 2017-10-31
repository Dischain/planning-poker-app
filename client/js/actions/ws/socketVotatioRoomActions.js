'use strict';

import { 
  JOIN, 
  INVITE, 
  SEND_VOTE, 
  SAVE_VOTATION 
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