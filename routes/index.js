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
  const { servicos } = req.body;

  if (Array.isArray(servicos) && servicos.length > 0) {
    
    console.log(`Recebidos ${servicos.length} serviço(s) para processar.`);

    servicos.forEach((servico, index) => {
      console.log(`\n--- Processando Serviço #${index + 1} ---`);
    
      console.log('Data:', servico.data);
      console.log('Talhão:', servico.talhao);
      console.log('Tipo de Serviço:', servico.servico_tipo);
      console.log('Valor:', servico.valor);

      const produtos = servico.produtos ? servico.produtos.filter(p => p && p.nome && p.nome.trim() !== '') : [];
      const trabalhadores = servico.trabalhadores ? servico.trabalhadores.filter(t => t && t.nome && t.nome.trim() !== '') : [];

      if (produtos.length > 0) {
        console.log('Produtos:');
        produtos.forEach((produto, pIndex) => {
          console.log(`  - Produto ${pIndex + 1}: ${produto.nome}, Quantidade: ${produto.quantidade}`);
        });
      } else {
        console.log('Nenhum produto associado.');
      }

      if (trabalhadores.length > 0) {
        console.log('Trabalhadores:');
        trabalhadores.forEach((trabalhador, tIndex) => {
          console.log(`  - Trabalhador ${tIndex + 1}: ${trabalhador.nome}, Diária: R$ ${trabalhador.diaria}`);
        });
      } else {
        console.log('Nenhum trabalhador associado.');
      }
    });

  } else {
    console.log('Nenhum serviço foi submetido ou o formato dos dados está incorreto.');
  }

  res.redirect('/servicos');
});

router.get('/detalhes', authController.isAuthenticated, function(req, res, next) {
  res.render('detalhes');
});

router.get('/editar', authController.isAuthenticated, function(req, res, next) {
  res.render('editar');
});

module.exports = router;
