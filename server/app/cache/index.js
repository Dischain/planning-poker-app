'use strict';

const redis = require('redis')
    , config = require('../config')

    , host = config.redis_cache.host
    , port = config.redis_cache.port
    , expiration = config.redis_cache.expiration

    , votationCache = require('./votationCache.js')
   // , commonCache = require('./commonCache.js');

const client = redis.createClient(port, host);

module.exports = ((connection) => {
  return {
    votationCache: votationCache(connection),
   // commonCache: commonCache(connection, expiration)
  }
})(client);