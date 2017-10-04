'use strict';

const config = require('./config.json');

function init() {
  if (process.env.NODE_ENV === 'production') {
    return config.production;
  } else {
    return config.development;
  }
}

module.exports = init();