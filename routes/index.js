var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController'); // Importa o controller

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: req.query.error });
});

router.post('/login', authController.login);


router.get('/servicos', authController.isAuthenticated, function(req, res, next) {
  res.render('servicos'); 
});


router.get('/adicionar-servico', authController.isAuthenticated, function(req, res, next) {
  res.render('adicionar-servico');
});


router.post('/adicionar-servico', authController.isAuthenticated, function(req, res, next) {

  const novoServico = req.body;


  console.log('Dados do novo serviço recebidos:');
  console.log(novoServico);

  res.redirect('/servicos');
});

router.get('/detalhes', authController.isAuthenticated, function(req, res, next) {
  res.render('detalhes');
});

module.exports = router;