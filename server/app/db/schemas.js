'use strict';

exports.create =  [
  {
    name: 'users',
    query:
      'CREATE TABLE IF NOT EXISTS users ('
    + 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, '
    + 'name VARCHAR(20) NOT NULL, '
    + 'email VARCHAR(30) NOT NULL, '
    + 'password BINARY(60) NOT NULL, '
    + 'avatar TEXT DEFAULT NULL, '
    + 'createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
    + 'UNIQUE INDEX (email), '
    + 'FULLTEXT (name), '
    + 'INDEX (password)'
    + ') Engine = MyISAM CHARSET=utf8;'
  },
  {
    name: 'votations',
    query:
      'CREATE TABLE IF NOT EXISTS votations ('
    + 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, '
    + 'title TEXT NOT NULL, '
    + 'description TEXT NOT NULL, '
    + 'creatorId INT UNSIGNED NOT NULL, '
    + 'createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
    + 'FULLTEXT (title, description), '
    + 'FOREIGN KEY (creatorId) REFERENCES users(id) ON DELETE CASCADE, '
    + 'INDEX (creatorId)'
    + ') Engine = MyISAM CHARSET=utf8;'
  },
  {
    name: 'votes',
    query:
      'CREATE TABLE IF NOT EXISTS votes ('
    + 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, '
    + 'votationId INT UNSIGNED NOT NULL, ' 
    + 'creatorId INT UNSIGNED NOT NULL, '
    + 'value ENUM ("1/2", "1", "2", "5", "8", "13", "20", "40", "100", "?", "inf") DEFAULT "?", '
    + 'INDEX (votationId, creatorId), '
    + 'FOREIGN KEY (creatorId) REFERENCES users(id), '
    + 'FOREIGN KEY (votationId) REFERENCES votations(id) ON DELETE CASCADE'
    + ') Engine = MyISAM CHARSET=utf8;'
  }
];