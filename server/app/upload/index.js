'use strict';

const fs = require('fs')
    , path = require('path')
    , uploader = require('express-fileupload')
    , config = require('../config')
    , constants = require('../constants');

let uploadPath;

module.exports = {
  init: function(app) {    
    if (process.env.NODE_ENV === constants.MODE_PRODUCTION) {
      
    } else {
      uploadPath = path.resolve('./', config.upload.path);
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    
    app.use(uploader());
  },

  mv: function(file) {
    console.log('mooving...')
    return new Promise((resolve, reject) => {
      let newPath = path.join(uploadPath, file.name);

      file.mv(newPath, (err) => {
        if (err) return reject(err);
        console.log(newPath);
        resolve(newPath);
      })
    });
  }
}