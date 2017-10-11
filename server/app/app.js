'use strict';

const express = require('express');
const bodyParser  = require('body-parser');
const express_session = require('express-session');
const redis   = require('redis');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(express_session);

const config = require('./config');
const db = require('./db');
const passport = require('./auth');
const userRouter = require('./routes/users.js');

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
  secret: config.redis_session.secret,
  store: new RedisStore({ 
    host: config.redis_session.host, 
    port: config.redis_session.port, 
    client: client, 
    ttl: config.redis_session.ttl 
  }),
  saveUninitialized: config.redis_session.saveUninitialized,
  resave: config.redis_session.resave
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);

app.use((req, res, next) => {
  res.status(404);
  res.json({'messsage': 'Not Found'});
});

app.listen(config.app.port, () => {
  db.init()
  .then(() => {
    console.log('Listening on port ' + config.app.port);
  })  
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
});

module.exports = app;