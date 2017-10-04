'use strict';

const db = require('../../db');
const factory = require('./factory.js');

exports.create = (userData) => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.create(userData), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.getAll = () => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.getAll(), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.getAllLimitedFromOffset = (first, last) => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.getAllLimitedFromOffset(first, last), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.getById = (id) => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.getById(id), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.getByEmail = (email) => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.getByEmail(email), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.deleteById = (id) => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.deleteById(id), (err, result) => {
        con.release();

        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.clear = () => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.clear(), (err, result) => {
        con.release();
        
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

exports.dropTable = () => {
  return db.getConnection().then((con) => {
    return new Promise((resolve, reject) => {
      con.query(factory.dropTable(), (err, result) => {
        con.release();
        
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};