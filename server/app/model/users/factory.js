'use strict';

const constants = require('./index.js').constants
    , DEfAULT_AVATAR_PATH = require('../../constants').DEfAULT_AVATAR_PATH;

module.exports = (query, data) => {
  switch(query) {
    case constants.CREATE_USER: {
      return data.avatar !== undefined ?
          'INSERT INTO USERS (name, email, password, avatar) VALUES ('
        + data.name + ', ' + data.email + ', '
        + data.password + ', ' + data.avatar + ');' :
          'INSERT INTO USERS (name, email, password, avatar) VALUES ('
        + data.name + ', ' + data.email + ', '
        + data.password + ', ' + DEfAULT_AVATAR_PATH + ');';
    }
    case constants.UPDATE_AVATAR_BY_USER_ID:
      return 'UPDATE USERS SET avatar=' + data.avatar + ' WHERE id = ' + data.id + ';';
    case constants.GET_ALL:
      return 'SELECT name, email, id FROM users;';
    case constants.GET_ALL_LIMITED_WITH_OFFSET:
      return 'SELECT name, email, id FROM users '
           + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.GET_USER_BY_ID:
      return 'SELECT name, email, id from users WHERE id = ' + data.id + ';';
    case constants.GET_USER_BY_EMAIL:
      return 'SELECT * from users WHERE email = ' + data.email + ';';
    case constants.FIND_USERS_LIMITED_FROM_OFFSET:
      return 'SELECT name, email, id FROM users WHERE MATCH (name) AGAINST (' + data.name + 'IN BOOLEAN MODE) '                 
            + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.FIND_USERS_REGEX_LIMITED_FROM_OFFSET:{
      let escapedStr = 'SELECT name, email, id FROM users WHERE name LiKE "%' + data.name + '%" '
                     + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
      return escapedStr.replace(/'/g, '');
    }
    case constants.DELETE_USER_BY_ID:
      return 'DELETE FROM users WHERE id = ' + data.id + ';';
    case constants.CLEAR_TABLE:
      return 'DELETE FROM users';
    case constants.DROP_TABLE:
      return 'DROP TABLE IF EXISTS users';
    default:
      return '';
  }  
};