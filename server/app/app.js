'use strict';

const express = require('express')
    , bodyParser  = require('body-parser')
    , express_session = require('express-session')
    , redis   = require('redis')
    , cors = require('cors')
    , cookieParser = require('cookie-parser')
    , RedisStore = require('connect-redis')(express_session)
    
    , config = require('./config')
    , db = require('./db')
    , passport = require('./auth')
    , userRouter = require('./routes/users.js')
    , votationsRouter = require('./routes/votations.js')
    , uploaderRouter = require('./routes/upload.js')

    , uploader = require('./upload')

    , app = express()
    , webSocketServer = require('./ws')(app)
    , client  = redis.createClient();

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

uploader.init(app);

app.use('/', userRouter);
app.use('/', votationsRouter);
app.use('/', uploaderRouter);

app.use((req, res, next) => {
  res.status(404);
  res.json({'messsage': 'Not Found'});
});

db.init()
.then(() => {
  webSocketServer.listen(config.app.port);
  
  console.log('Listening on port ' + config.app.port);
})  
.catch((err) => {
  console.log(err);
  process.exit(1);
}); 

module.exports = app;