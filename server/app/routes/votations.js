'use strict';

const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , votations = require('../model').getModel(modelNames.VOTATIONS_MODEL)
    , votationsConstants = require('../model/votations').constants
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants
    , votes = require('../model').getModel(modelNames.VOTES_MODEL)
    , votesConstants = require('../model/votes').constants;

router.post('/votations', users.isAuthenticated, (req, res) => {
  const votationData = req.body.votationData
      , votesData = req.body.votes;

      let votationId; 
  
  votations.query(votationsConstants.CREATE_VOTATION, votationData)
  .then((result) => {
    votationId = result.insertId;
    
    return votesData.reduce((initial, vote) => {
      vote.votation_id = votationId;
      return initial.then(() => votes.query(votesConstants.CREATE_VOTE, vote));
    }, Promise.resolve());
  })
  .then(() => res.status(201).json(JSON.stringify({ votationId: votationId })))
  .catch((err) => res.sendStatus(500));
});

router.get('/votations', users.isAuthenticated, (req, res) => {
    votations.query(votationsConstants.GET_ALL_WITH_VOTES_LIMITED_BY_OFFSET, { 
      limit: req.body.limit,
      offset: req.body.offset
    })
    .then((result) => {
      let combinedVotations = _combineVotesByVotations(result);
      res.status(200).json(JSON.stringify(combinedVotations));
    })
    .catch((err) => res.sendStatus(500));
});

router.get('/votations/:id', users.isAuthenticated, (req, res) => {
    const votationId = req.params.id;

    votations.query(votationsConstants.GET_FULL_VOTATION_BY_ID, { id: votationId })
    .then((result) => {
      if (result.length === 0)
        return res.sendStatus(404);

      let votationData = {
        title: result[0].title,
        description: result[0].description,
        creatorId: result[0].creatorId,
        votationId: votationId,
        createdAt: result[0].createdAt
      };

      let votes = result.map((item) => {
        return { value: item.value, creatorId: item.userId, name: item.name };
      });

      res.status(200).json(JSON.stringify({
        votationData: votationData,
        votes: votes
      }));
    })
    .catch((err) => res.sendStatus(500));
});

router.get('/votations_search', users.isAuthenticated, (req, res) => { 
  votations.query(votationsConstants.FIND_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET, {
    text: req.body.text, limit: req.body.limit, offset: req.body.offset
  })
  .then((result) => {
    let combinedVotations = _combineVotesByVotations(result);
    res.status(200).json(JSON.stringify(combinedVotations));
  })
  .catch((err) => res.sendStatus(500));
});

router.get('/votations_by_user/:id', users.isAuthenticated, (req, res) => {
  votations.query(votationsConstants.GET_USER_VOTATIONS_WITH_VOTES_LIMITED_FROM_OFFSET, {
    creatorId: req.params.id, limit: req.body.limit, offset: req.body.offset
  })
  .then((result) => {
    let combinedVotations = _combineVotesByVotations(result);
    res.status(200).json(JSON.stringify(combinedVotations));
  })
  .catch((err) => res.sendStatus(500));
});

router.delete('/votations/:id', users.isAuthenticated, (req,res) => {
  votations.query(votationsConstants.DELETE_VOTATION_BY_ID, { id: req.params.id })
  .then(() => res.sendStatus(201))
  .catch((err) => res.sendStatus(500));
});

function _combineVotesByVotations(result) {
  let lastVisitedVotationId = 0, combinedVotations = [];
    
  for(let i = lastVisitedVotationId; i < result.length; i++) { 
    let item = result[i];

    if (i !== 0 && item.votationId === result[i - 1].votationId)
      continue;
    else {
      let votationData = {
        title: item.title,
        description: item.description,
        votationId: item.votationId,
        creatorId: item.creatorId,
        createdAt: result[0].createdAt
      }, votes = [];
          
      for (let j = i; j < result.length ; j++) {
        lastVisitedVotationId = j;
          
        if (item.votationId !== result[j].votationId)
          break;
        else {
          votes.push({
            value: result[j].value,
            creatorId: result[j].userId,
            name: result[j].name
          });
        }
      }
          
      combinedVotations.push({
        votationData: votationData,
        votes: votes
      });
    }
  }
  
  return combinedVotations;
}

module.exports = router;