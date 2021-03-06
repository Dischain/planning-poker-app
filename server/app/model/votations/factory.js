'use strict';

const constants = require('./index.js').constants;

module.exports = (query, data) => {
  switch(query) {
    case constants.CREATE_VOTATION:
      return 'INSERT INTO votations (title, description, creatorId) VALUES ('
              + data.title + ', ' + data.description + ', ' + data.creatorId + ');';
    case constants.GET_ALL:
      return 'SELECT * FROM votations ORDER BY createdAt DESC;';
    case constants.GET_VOTATION_BY_ID: 
      return 'SELECT * FROM votations WHERE votations.id = ' + data.id + ';';
    case constants.GET_FULL_VOTATION_BY_ID:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creatorId creatorId, '
           + 'vtn.createdAt createdAt, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votationId '
           + 'INNER JOIN users u ON vt.creatorId = u.id '
           + 'WHERE vtn.id = ' + data.id + ';';
    case constants.GET_ALL_LIMITED_FROM_OFFSET:
      return 'SELECT * FROM votations LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creatorId creatorId, '
           + 'vtn.createdAt createdAt, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votationId '
           + 'INNER JOIN users u ON vt.creatorId = u.id '
           + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.FIND_VOTATIONS_LIMITED_FROM_OFFSET: 
      return 'SELECT * FROM votations WHERE MATCH (title,description) AGAINST (' + data.text + ') '
           + ' ORDER BY createdAt DESC '
           + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';  
    case constants.FIND_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET: 
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creatorId creatorId, '
          + 'vtn.createdAt createdAt, vt.value, u.name, u.id userId FROM '
          + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votationId '
          + 'INNER JOIN users u ON vt.creatorId = u.id '
          + 'WHERE MATCH (vtn.title,vtn.description) AGAINST (' + data.text + ') '
          + 'ORDER BY vtn.createdAt DESC '
          + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';'; 
    case constants.GET_USER_VOTATIONS_LIMITED_FROM_OFFSET:
      return 'SELECT * FROM votations WHERE votations.creatorId = ' + data.creatorId
           + ' ORDER BY createdAt DESC'
           + ' LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creatorId creatorId, '
           + 'vtn.createdAt createdAt, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votationId '
           + 'INNER JOIN users u ON vt.creatorId = u.id '
           + 'WHERE vtn.creatorId = ' + data.creatorId
           + ' LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.DELETE_VOTATION_BY_ID:
      return 'DELETE FROM votations WHERE id = ' + data.id + ';';
    case constants.CLEAR_TABLE:
      return 'DELETE FROM votations;';
    case constants.DROP_TABLE:
      return 'DROP TABLE IF EXISTS votations;';
    default:
      return '';
  }
};