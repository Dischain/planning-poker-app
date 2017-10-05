'use strict';

const mysql = require('mysql');

const config = require('../config');
const constants = require('../constants');
const tablesSchemas = require('./schemas.js');

let state = {
  pool: null,
  mode: process.env.NODE_ENV
};

exports.init = () => {
  return new Promise((resolve, reject) => {
    if (state.mode === constants.MODE_PRODUCTION) {
      state.pool = mysql.createPoolCluster();

      state.pool.add(config.mysql.write_node.name, {
        host: config.mysql.write_node.host,
        user: config.mysql.write_node.user,
        password: config.mysql.write_node.password,
        database: config.mysql.dbName
      });

      state.pool.add(config.mysql.read1_node.name, {
        host: config.mysql.read1_node.host,
        user: config.mysql.read1_node.user,
        password: config.mysql.read1_node.password,
        database: config.mysql.dbName
      });

      state.pool.add(config.mysql.read2_node.name, {
        host: config.mysql.read2_node.host,
        user: config.mysql.read2_node.user,
        password: config.mysql.read2_node.password,
        database: config.mysql.dbName
      });
    } else {
      state.pool = mysql.createPool({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.dbName
      });
    }

    if (!state.pool) return reject(new Error('Missing database connection'));

    // create it serially
    Promise.all(tablesSchemas.create.map((schema) => {
      return _createTable(schema.query);
    })).then(() => resolve());
  });
};

exports.getConnection = (type) => {
  const pool = state.pool;

  return new Promise((resolve, reject) => {
    if (state.mode === constants.MODE_PRODUCTION) {
      if (type === constants.WRITE) {
        pool.getConnection(constants.WRITE, (err, connection) => {  
          if (err) return reject(err);
          resolve(connection);
        });
      } else if (type === constants.READ) {
        pool.getConnection(constants.READ, (err, connection) => {
          if (err) return reject(err);      
          resolve(connection);
        });
      }
    } 
    else {
      pool.getConnection((err, connection) => {
        if (err) return reject(err);
        resolve(connection);
      });
    }
  });
};

exports.closeConnection = () => {
  const pool = state.pool;

  return new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

/*                      Helper functions
*******************************************************************/

function _createTable(query) {
  const pool = state.pool;

  return new Promise((resolve, reject) => {
    pool.query(query, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// const users = require('../model/users');
// exports.init().then(() => { 
//   users.create({
//     name: 'user',
//     email: 'user@email.com',
//     password: 'password'
//   })
//   .then(console.log)
//   .catch((err) => {
//     console.log('probably there');
//     console.log(err);
//   });
// });