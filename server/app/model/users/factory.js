'use strict';

const constants = require('./index.js').constants;

module.exports = (query, data) => {
  switch(query) {
    case constants.CREATE_USER: {
      return data.avatar !== undefined ?
          'INSERT INTO USERS (name, email, password, avatar) VALUES ('
        + data.name + ', ' + data.email + ', '
        + data.password + ', ' + data.avatar + ');' :
          'INSERT INTO USERS (name, email, password) VALUES ('
        + data.name + ', ' + data.email + ', '
        + data.password + ');';
    }
    case constants.GET_ALL:
      return 'SELECT * FROM users;';
    case constants.GET_USER_BY_ID:
      return 'SELECT * from users WHERE id = ' + data.id + ';';
    case constants.GET_USER_BY_EMAIL:
      return 'SELECT * from users WHERE email = ' + data.email + ';';
    case constants.FIND_USERS_LIMITED_FROM_OFFSET:
      return 'SELECT * FROM users WHERE MATCH (name) AGAINST (' + data.name + 'IN BOOLEAN MODE) '                 
            + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.DELETE_USER_BY_ID:
      return 'DELETE FROM users WHERE id = ' + data.id + ';';
    case constants.CLEAR_TABLE:
      return 'DELETE FROM users';
    case constants.DROP_TABLE:
      return 'DELETE FROM users';
    default:
      return '';
  }  
};