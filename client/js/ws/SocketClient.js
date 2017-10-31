'use strict';

import io from 'socket.io-client';

export default class SocketClient {
  constructor(nsp, host = config.host, userId) {
    this.nsp = nsp;
    this.host = host;
    this.userId = userId;
  }

  connect(query, promiseCallback) {
    let getType = {}, promise;

    if (!promiseCallback.then) {
      promise = function() { return Promise.resolve(); };
    } else {
      promise = promiseCallback;
    }
    
    let uri = this.host + (query ? query : '');
    this.socket = io.connect(uri, { transports: ['websocket'] });

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => { 
        promise().then(resolve);        
      });
      this.socket.on('connect_error', (error) => reject(error));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      return this.socket.emit(event, data, (response) => {
        if (response.error) {
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  on(event, fun) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      this.socket.on(event, fun);
      resolve();
    });
  }
}