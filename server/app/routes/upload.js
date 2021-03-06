'use strict';

const router = require('express').Router()
    , upload = require('../upload')
    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

router.post('/upload', (req, res) => {
  let id = req.body.id;
  let file = req.files.avatar;

  // TODO: generate random hash string
  file.name = id + file.name;
  upload.mv(file)
  .then((pathToAvatar) => 
    users.query(userConstants.UPDATE_AVATAR_BY_USER_ID, { id, avatar: pathToAvatar })
  )
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

module.exports = router;