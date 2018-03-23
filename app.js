const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const  index = require('./routes/index')
      ,roboto = require('./routes/roboto')
      ,multy = require('./routes/multy')
      ,physic = require('./routes/physic')
      ,net = require('./routes/net')
      ,stats = require('./routes/stats')
      ,users = require('./routes/users');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

let allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
};

app.use(allowCrossDomain);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//sessions

app.use(session({
   secret: 'i need more beers',
   resave: false,
   saveUninitialized: false,
   // Место хранения можно выбрать из множества вариантов, это и БД и файлы и Memcached.
   store: new MongoStore({
      url: 'mongodb://127.0.0.1:27017/usersSessions'
   })
}));


app.use('/', index);
app.use('/roboto', roboto);
app.use('/multy', multy);
app.use('/physic', physic);
app.use('/net', net);
app.use('/stats', stats);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  err.message= "Page not found";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
