'use strict';

export default function socketMiddleware(sockets) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { useSocket, nsp, type, promise, ...rest } = action;

    let socket = sockets[nsp];

    if (!useSocket) {
      return next(action);
    }

    if (!socket.dispatch) socket.dispatch = dispatch;

    return promise(socket)
      .then((result) => next({ ...rest, result, type }));
  }
}