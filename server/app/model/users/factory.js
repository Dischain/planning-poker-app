'use strict';

exports.create = (userData) => {
  return 'INSERT INTO USERS (name, email, password, avatar) VALUES '
       + '(' + '"' + userData.name + '", ' + '"' + userData.email + '", '
       + '"' + userData.password + '", ' + '"' + userData.avatar + '");';
};

exports.getAll = () => {
  return 'SELECT * FROM users;';
};

exports.getAllLimitedFromOffset = (limit, offset) => {
  return 'SELECT * FROM users LIMIT ' + limit + ' OFFSET ' + offset + ';';
};

exports.getById = (id) => {
  return 'SELECT * from users WHERE id = ' + id + ';';
};

exports.getByEmail = (email) => {
  return 'SELECT * from users WHERE email = "' + email + '";';
};

exports.deleteById = (id) => {
  return 'DELETE FROM users WHERE id = ' + id + ';';
};

exports.clear = () => {
  return 'DELETE FROM users';
};

exports.dropTable = () => {
  return 'DROP TABLE IF EXISTS users';
};