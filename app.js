const express = require('express');
const logger = require('morgan');
// const bodyParser 	= require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');

const v1 = require('./routes/v1');
const app = express();

const CONFIG = require('./config/config');

app.use(logger('dev'));



//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app)
//DATABASE
const models = require("./models");
models.sequelize.authenticate().then(() => {
  console.log('Connected to SQL database:', CONFIG.db_name);
})
  .catch(err => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
  });

// CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1', v1);

app.use('/', function (req, res) {
  res.statusCode = 200;//send the appropriate status code
  res.json({ status: "success", message: "Home Page", data: {} })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});