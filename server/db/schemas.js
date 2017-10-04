'use strict';

exports.create =  [
  {
    name: 'users',
    query:
      'CREATE TABLE IF NOT EXISTS users ('
    + 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, '
    + 'name VARCHAR(20) NOT NULL, '
    + 'email VARCHAR(20) NOT NULL, '
    + 'password VARCHAR(20) NOT NULL, '
    + 'avatar BLOB DEFAULT NULL, '
    + 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
    + 'UNIQUE INDEX (email), '
    + 'INDEX (password)'
    + ');'
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
    + ');'
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
    + ');'
  }
];