'use strict';

import SocketClient from './SocketClient.js';

import { 
  seCurrentVotationId 
} from '../actions/ws/socketVotationActions.js';

let socket = new SocketClient('/votations', );

socket.on('VOTATION_CREATED', (votationId) => { 
  socket.dispatch(seCurrentVotationId(votationId));
});

export default socket;