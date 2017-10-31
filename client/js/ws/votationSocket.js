'use strict';

import SocketClient from './SocketClient.js';

let socket = new SocketClient('/votations', );

socket.on('VOTATION_CREATED', (votationId) => { 
  socket.dispatch(setNewlyCreatedVotationId(votationId));
});

export default socket;