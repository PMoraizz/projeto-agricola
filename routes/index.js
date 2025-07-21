var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var Servico = require('../models/Servico'); 

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


router.post('/adicionar-servico', authController.isAuthenticated, async function(req, res, next) {
  console.log('DADOS RECEBIDOS DO FORMULÁRIO:', JSON.stringify(req.body, null, 2));

  const { servicos } = req.body;

  if (!Array.isArray(servicos) || servicos.length === 0) {
    console.log('Nenhum serviço foi submetido ou o formato dos dados está incorreto.');
    return res.redirect('/adicionar-servico');
  }

  try {
    for (const servicoData of servicos) {
      const produtos = servicoData.produtos ? servicoData.produtos.filter(p => p && p.nome && p.nome.trim() !== '') : [];

      
      let trabalhadoresCorrigidos = [];
      if (servicoData.trabalhadores && servicoData.trabalhadores.length > 0) {
        // Itera sobre cada item de trabalhador recebido
        servicoData.trabalhadores.forEach(trabalhador => {
          // Verifica se o campo 'nome' é uma lista (o problema que encontramos)
          if (Array.isArray(trabalhador.nome)) {
            // Se for uma lista, transforma cada nome da lista em um objeto trabalhador separado
            const nomesIndividuais = trabalhador.nome.map(nome => ({ nome: nome }));
            trabalhadoresCorrigidos.push(...nomesIndividuais);
          } else {
            // Se não for uma lista, apenas adiciona o trabalhador (caso de 1 trabalhador)
            trabalhadoresCorrigidos.push(trabalhador);
          }
        });
      }
      
      
      const trabalhadores = trabalhadoresCorrigidos.filter(t => t && t.nome && String(t.nome).trim() !== '');
      

      const novoServico = new Servico({
        data: servicoData.data,
        talhao: servicoData.talhao,
        servico_tipo: servicoData.servico_tipo,
        valor_servico: servicoData.valor_servico,
        produtos: produtos,
        trabalhadores: trabalhadores
      });

      await novoServico.save();
      console.log('Serviço salvo com sucesso no banco de dados:', novoServico.talhao);
    }

    res.redirect('/servicos');

  } catch (error) {
    console.error('Erro ao salvar o serviço no MongoDB:', error);
    res.redirect('/adicionar-servico?error=true');
  }
});

router.get('/detalhes', authController.isAuthenticated, function(req, res, next) {
  res.render('detalhes');
});

router.get('/editar', authController.isAuthenticated, function(req, res, next) {
  res.render('editar');
});

module.exports = router;
