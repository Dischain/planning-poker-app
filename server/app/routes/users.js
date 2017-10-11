const router = require('express').Router()
    , passport = require('passport')
    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

router.post('/register', (req, res) => {
  const credentials = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  users.register(credentials)
  .then((result) => res.status(201).json(JSON.stringify({userId: result.insertId})))
  .catch((err) => {
    if (err.message === constants.EMAIL_EXISTS)
      res.status(409).json(JSON.stringify({message: constants.EMAIL_EXISTS})); 
    //else if// и т.д.
    else
      res.sendStatus(500);
  });
});

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (user) {
      req.logIn(user, (err) => {
        if (err) return next(err);

        let userData = {
          name: user.name,
          email: user.email,
          userId: user.id
        };

        res.status(200).json(JSON.stringify(userData));
      });
    } else {

      res.sendStatus(401);
    }
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  req.session = null;

  res.sendStatus(200);
});

router.get('/users', (req, res) => {
  users.query(userConstants.GET_ALL_LIMITED_WITH_OFFSET, {
    limit: req.body.limit, offset: req.body.offset
  })
  .then((result) => res.json(JSON.stringify({ users: result })))
  .catch((err) => res.sendStatus(500));
});

router.get('/users/:id', (req, res) => {
  users.query(userConstants.GET_USER_BY_ID, { id: req.params.id })
  .then((result) => {
    let data = { name: result[0].name, email: result[0].email, userId: result[0].id };
    return res.json(JSON.stringify(data));
  })
  .catch((err) => res.sendStatus(500));
});

module.exports = router;