'use strict';

const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , modelNames = require('../model').modelNames
    , users = require('../model').getModel(modelNames.USERS_MODEL)
    , userConstants = require('../model/users').constants;

let init = function() {
  passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {    
  users.query(userConstants.GET_USER_BY_ID, {id: id})
  .then((user) => done(null, user));
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {

  users.query(userConstants.GET_USER_BY_EMAIL, {email: email})
  .then((user) => {
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    users.validatePassword(user, password)
      .then((isMatch) => {
        isMatch ? 
          done(null, user) : 
          done(null, false, { message: 'Incorrect username or password'});
      })
      .catch(err => done(err));
  })
  .catch(err => done(err));
}));

return passport;
};

module.exports = init();