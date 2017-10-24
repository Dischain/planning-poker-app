'use strict';

const redis = require('redis')
    , config = require('../config')

    , host = config.redis_cache.host
    , port = config.redis_cache.port
    , expiration = config.redis_cache.expiration

    , votationCache = require('./votationCache.js')
   // , commonCache = require('./commonCache.js');

const client = redis.createClient(port, host);

function flush() {
  return new Promise((resolve, reject) => {
    client.flushdb((err) => {
      if (err) return reject(err);
      return resolve();
    })
  });
}

module.exports = ((connection) => {
  return {
    votationCache: votationCache(connection),
   // commonCache: commonCache(connection, expiration)
   flush: flush
  }
})(client);