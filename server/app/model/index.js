'use strict';

const escape = require('mysql').escape
    , isPlainObject = require('lodash.isplainobject')
    , db = require('../db')
    , usersQueryFactory     = require('./users/factory.js')
    , votationsQueryFactory = require('./votations/factory.js')
    , votesQueryFactory     = require('./votes/factory.js');

exports.modelNames = {
  USERS_MODEL: 'users',
  VOTATIONS_MODEL: 'votations',
  VOTES_MODEL: 'votes'
};

exports.getModel = (modelName) => { 
  let factory = _mapModelNameToFactory(modelName);

  return {
    query: (query, rawData, middleware) => { 
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

            if (middleware !== undefined) {
              middleware = (typeof middleware === 'function') ? middleware : function() {};
              
              middleware(escapedData).then((err, result) => {
                  if (err) {
                    con.release();
                    return reject(err);
                  }
              });
            } 
            
            con.release();
            resolve(result);
          });
        });
      });
    }   
  };
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