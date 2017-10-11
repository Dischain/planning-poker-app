'use strict';

const escape = require('mysql').escape
    , isPlainObject = require('lodash.isplainobject')
    , db = require('../db')
    , usersQueryFactory     = require('./users/factory.js')
    , votationsQueryFactory = require('./votations/factory.js')
    , votesQueryFactory     = require('./votes/factory.js')

    , constants = require('../constants')
    , bcrypt = require('bcrypt-nodejs');

exports.modelNames = {
  USERS_MODEL: 'users',
  VOTATIONS_MODEL: 'votations',
  VOTES_MODEL: 'votes'
};

exports.getModel = (modelName) => { 
  let factory = _mapModelNameToFactory(modelName);

  let model = {};

  model.query = (query, rawData) => { 
    let escapedData;
    const args = arguments;

    if (rawData !== undefined) {
      if (isPlainObject(rawData)) {
        escapedData = Object.keys(rawData).reduce((init, key) => {
          if (key === 'limit' || key === 'offset') // dirty hack
            init[key] = rawData[key];
          else
            init[key] = escape(rawData[key]);              

          return init;
        }, {});
      } else {
        escapedData = escape(rawData);
      }
    }

    return new Promise((resolve, reject) => {
      db.getConnection().then((con) => {
        con.query(factory(query, escapedData), (err, result) => {
          if (err) {
            con.release();
            return reject(err);
          }
          
          con.release();
          resolve(result);
        });
      });
    });
  };   

  if (modelName === 'users') {
    model.register = (userData) => {
      if (userData.avatar === undefined)
        userData.avatar = constants.DEfAULT_AVATAR_PATH;
      
      return new Promise((resolve, reject) => {
         bcrypt.genSalt(constants.SALT_WORK_FACTOR, (err, salt) => {
           if(err) return reject(err);
  
           bcrypt.hash(userData.password, salt, null, (err, hash) => {
            if(err) return reject(err);
            
            model.query('CREATE_USER', {
              name: userData.name,
              email: userData.email,
              password: hash
            })
            .then(resolve)
            .catch(reject);
           });
         });
      });
    };

    model.validatePassword = (credentials, password) => {
      return new Promise((resolve, reject) => {
        model.query('GET_USER_BY_EMAIL', { email: credentials.email }) 
        .then((user) => {
          if (user.length === 0) return reject(new Error('invalid email'));

          const hashPassword = user[0].password;

          bcrypt.compare(password, hashPassword.toString(), (err, match) => {
            if (err) return reject(new Error('invalid password'));

            resolve(match);
          });
        });
      });
    };

    model.isAuthenticated = (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.sendStatus(401);
      }
    };
  }
  
  return model;
};
  
function _mapModelNameToFactory(modelName) {
  const modelNames = exports.modelNames;

  switch (modelName) {
    case modelNames.USERS_MODEL:
      return usersQueryFactory;
    case modelNames.VOTATIONS_MODEL:
      return votationsQueryFactory;
    case modelNames.VOTES_MODEL:
      return votesQueryFactory;
  }
}