'use strict';

const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATION_MODEL)
    , votationsConstants = require('../model/votations').constants
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

router.post('/votations', users.isAuthenticated, (req, res) => {
  const votationData = req.body.votationData
      , votes = req.body.votes;
  
  let votationId; 

  votations.query(votationsConstants.CREATE_VOTATION, votationData)
  .then((result) => {
    votationId = result.insertId;

    return votes.reduce((initial, vote) => {
        vote.votation_id = result.insertId;
        return initial.then(() => votes.query(votesConstant.CREATE_VOTE), vote);
    }, Promise.resolve());
  })
  .then(() => res.status(201).json(JSON.stringify({ votationId: votationId })))
  .catch((err) => res.sendStatus(500));
});