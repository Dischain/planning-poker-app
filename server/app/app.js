'use strict';

const express = require('express');
const bodyParser  = require('body-parser');
const express_session = require('express-session');
const redis   = require('redis');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//const RedisStore = require('connect-redis')(express_session);

const config = require('./config');
const db = require('./db');
//const passport = require('./auth');

const app = express();
const client  = redis.createClient();

app.use(cors(config.app.corsOptions));
app.use((req, res, next) => {
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_session({
  secret: config.session.secret,
  store: new RedisStore({ 
    host: config.session.host, 
    port: config.session.port, 
    client: client, 
    ttl: config.session.ttl 
  }),
  saveUninitialized: config.session.saveUninitialized,
  resave: config.session.resave
}));
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  res.status(404);
  res.json({'msg': 'Not Found'});
});

db.init()
.then(() => {
  app.listen(config.app.potr, () => {
    console.log('Listening on port ' + config.app.potr);
  });
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});