'use strict';

const constants = require('./index.js').constants;

module.exports = (query, data) => {
  switch (query) {
    case constants.CREATE_VOTE:
      return 'INSERT INTO votes (votation_id, creator_id, value) VALUES ('
            + data.votation_id + ', ' + data.creator_id + ', ' + data.value + ');';
    case constants.GET_VOTES_BY_VOTATION_ID:
      return 'SELECT value FROM votations LEFT JOIN votes ON votations.id = votes.votation_id '
            + 'WHERE votations.id = ' + data.votation_id + ';';
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