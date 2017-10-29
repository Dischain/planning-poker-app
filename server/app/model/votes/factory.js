'use strict';

const constants = require('./index.js').constants;

module.exports = (query, data) => {
  switch (query) {
    case constants.CREATE_VOTE:
      return 'INSERT INTO votes (votationId, creatorId, value) VALUES ('
            + data.votationId + ', ' + data.creatorId + ', ' + data.value + ');';
    case constants.GET_VOTES_BY_VOTATION_ID:
      return 'SELECT value FROM votations LEFT JOIN votes ON votations.id = votes.votationId '
            + 'WHERE votations.id = ' + data.votationId + ';';
    case constants.GET_ALL:
      return 'SELECT * FROM votes;';
    case constants.CLEAR_TABLE:
      return 'DELETE FROM votes;';
    case constants.DROP_TABLE:
      return 'DROP TABLE IF EXISTS votes;';
    default:
      return '';
  }
};