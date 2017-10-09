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
    + 'avatar BLOB DEFAULT NULL, '
    + 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
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
    + 'creator_id INT UNSIGNED NOT NULL, '
    + 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
    + 'FULLTEXT (title, description), '
    + 'FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE, '
    + 'INDEX (creator_id)'
    + ') Engine = MyISAM CHARSET=utf8;'
  },
  {
    name: 'votes',
    query:
      'CREATE TABLE IF NOT EXISTS votes ('
    + 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, '
    + 'votation_id INT UNSIGNED NOT NULL, ' 
    + 'creator_id INT UNSIGNED NOT NULL, '
    + 'value ENUM ("1/2", "1", "2", "5", "8", "13", "20", "40", "100", "?", "inf") DEFAULT "?", '
    + 'INDEX (votation_id, creator_id), '
    + 'FOREIGN KEY (creator_id) REFERENCES users(id), '
    + 'FOREIGN KEY (votation_id) REFERENCES votations(id) ON DELETE CASCADE'
    + ') Engine = MyISAM CHARSET=utf8;'
  }
];