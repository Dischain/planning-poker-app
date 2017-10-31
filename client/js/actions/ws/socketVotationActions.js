'use strict';

import { 
  CREATE_VOTATION, 
  SET_NEWLY_CREATED_VOTATION_ID 
} from '../../constants/socketVotationConstants.js';

let useSocket = true, nsp = 'votations';

export function createVotation(votationData) {
  return {
    useSocket,
    nsp, 
    type: CREATE_VOTATION, 
    promise: (socket) => socket.emit(CREATE_VOTATION, votationData)   
  };
}

export function setNewlyCreatedVotationId(votationId) {
  return {
      type: SET_NEWLY_CREATED_VOTATION_ID,
      votationId
  };
}