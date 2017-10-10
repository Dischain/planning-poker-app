'use strict';

const constants = require('./index.js').constants;

module.exports = (query, data) => {
  switch(query) {
    case constants.CREATE_VOTATION:
      return 'INSERT INTO votations (title, description, creator_id) VALUES ('
              + data.title + ', ' + data.description + ', ' + data.creator_id + ');';
    case constants.GET_ALL:
      return 'SELECT * FROM votations ORDER BY created_at DESC;';
    case constants.GET_VOTATION_BY_ID: 
      return 'SELECT * FROM votations WHERE votations.id = ' + data.id + ';';
    case constants.GET_ALL_LIMITED_FROM_OFFSET:
      return 'SELECT * FROM votations LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creator_id creatorId, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votation_id '
           + 'INNER JOIN users u ON vt.creator_id = u.id '
           + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.FIND_VOTATIONS_LIMITED_FROM_OFFSET: 
      return 'SELECT * FROM votations WHERE MATCH (title,description) AGAINST (' + data.text + ') '
           + ' ORDER BY created_at DESC '
           + 'LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';    
    case constants.GET_USER_VOTATIONS_LIMITED_FROM_OFFSET:
      return 'SELECT * FROM votations WHERE votations.creator_id = ' + data.creatorId
           + ' ORDER BY created_at DESC'
           + ' LIMIT ' + data.limit + ' OFFSET ' + data.offset + ';';
    case constants.GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET:
      return 'SELECT vtn.title, vtn.description, vtn.id votationId, vtn.creator_id creatorId, vt.value, u.name, u.id userId FROM '
           + 'votations vtn LEFT JOIN votes vt ON vtn.id = vt.votation_id '
           + 'INNER JOIN users u ON vt.creator_id = u.id '
           + 'WHERE vtn.creator_id = ' + data.creatorId
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