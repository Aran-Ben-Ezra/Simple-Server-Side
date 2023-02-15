//Roi Katz 313299729 Aran Ben Ezra 316256403
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const addCostRouter = require('./routes/addcost');
const reportsRouter = require('./routes/reports');

const connectDatabase = async () =>{
  try{
    await mongoose.connect("mongodb+srv://apiproject:Api123123!@cluster0.wvfnl3l.mongodb.net/?retryWrites=true&w=majority");
    console.log("connected to database");
  } catch (error){
    console.log(error);
  }
}
connectDatabase();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', aboutRouter);
app.use('/', addCostRouter);
app.use('/', reportsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
