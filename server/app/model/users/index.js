'use strict';

const db = require('../../db');
const factory = require('./factory.js');

exports.constants = {
  CREATE_USER: 'CREATE_USER',
  GET_ALL: 'GET_ALL',
  GET_USER_BY_ID: 'GET_USER_BY_ID',
  GET_USER_BY_EMAIL: 'GET_USER_BY_EMAIL',
  FIND_USERS_LIMITED_FROM_OFFSET: 'FIND_USERS_LIMITED_FROM_OFFSET',
  DELETE_USER_BY_ID: 'DELETE_USER_BY_ID',
  CLEAR_TABLE: 'CLEAR_TABLE',
  DROP_TABLE: 'DROP_TABLE'
};