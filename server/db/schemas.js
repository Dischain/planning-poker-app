'use strict';

exports.create =  [
    'create table if not exists test_table '
  + '(id integer primary key auto_increment not null, '
  + 'first_name text, last_name text);'
];