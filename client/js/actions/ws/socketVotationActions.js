'use strict';

import { 
  CREATE_VOTATION, 
  SET_CURRENT_VOTATION 
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

export function seCurrentVotation(votation) {
  return {
      type: SET_CURRENT_VOTATION,
      votation
  };
}