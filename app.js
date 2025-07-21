var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // 1. Importe o express-session
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//Quando usar Docker fazer isso
// mongoose.connect('mongodb://admin:senha123@localhost:27277/agricola?authSource=admin', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Conectado ao MongoDB!');
// }).catch((err) => {
//   console.error('Erro ao conectar ao MongoDB:', err);
// });

mongoose.connect('mongodb://localhost:27017/agricola', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB com sucesso na porta 27017!');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Configure o middleware de sessão
//    IMPORTANTE: O 'secret' deve ser uma string longa e aleatória em produção.
app.use(session({
  secret: 'seu-segredo-super-secreto-aqui', // Troque por uma chave segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Em produção, com HTTPS, use { secure: true }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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