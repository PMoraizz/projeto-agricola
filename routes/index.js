var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var Servico = require('../models/Servico');
var Usuario = require('../models/Usuario');

// Mapa central de serviços para tradução e exibição
const servicosMap = {
  adubacao: 'Adubação',
  aplicacao_fungicida: 'Aplicação de Fungicida',
  aplicacao_herbicida: 'Aplicação de Herbicida',
  aplicacao_inseticida: 'Aplicação de Inseticida',
  arruacao: 'Arruação',
  capinar: 'Capinar',
  corretivo_aplicacao_manual: 'Corretivo - Aplicação Manual',
  desbarra: 'Desbarra',
  desbrota: 'Desbrota',
  drench_nutricional_fungicida_inseticida: 'Drench (Nutricional + Fungicida + Inseticida)',
  drench: 'Drench',
  gesso_aplicacao_manual: 'Gesso Aplicação Manual',
  limpeza: 'Limpeza',
  microterraceamento: 'Microterraceamento',
  poda: 'Poda',
  pulverização_nutricional: 'Pulverização Nutricional',
  plantio: 'Plantio',
  replantio: 'Replantio',
  rocada: 'Roçada'
};

// --- ROTAS ABERTAS ---
router.get('/', (req, res, next) => res.render('index'));
router.get('/login', (req, res, next) => res.render('login', { error: req.flash('error') }));
router.post('/login', authController.login);
router.get('/registrar', (req, res) => res.render('registrar'));
router.post('/registrar', async (req, res) => {
  try {
    const { username, password } = req.body;
    const novoUsuario = new Usuario({ username, password });
    await novoUsuario.save();
    res.redirect('/login');
  } catch (error) {
    res.redirect('/registrar?error=true');
  }
});

// --- ROTAS PROTEGIDAS ---
router.get('/servicos', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servicosDoUsuario = await Servico.find({ proprietario: req.session.userId }).sort({ data: -1 });
    res.render('servicos', { servicos: servicosDoUsuario, servicosMap });
  } catch (error) {
    next(error); 
  }
});

router.get('/adicionar-servico', authController.isAuthenticated, (req, res, next) => {
  res.render('adicionar-servico');
});

router.post('/adicionar-servico', authController.isAuthenticated, async (req, res, next) => {
  const { servicos } = req.body;
  if (!Array.isArray(servicos) || servicos.length === 0) {
    return res.redirect('/adicionar-servico');
  }
  try {
    for (const servicoData of servicos) {
      const produtos = (servicoData.produtos || []).filter(p => p && p.nome && p.nome.trim() !== '');
      let trabalhadoresCorrigidos = [];
      (servicoData.trabalhadores || []).forEach(trabalhador => {
        if (!trabalhador) return;
        if (Array.isArray(trabalhador.nome)) {
          trabalhadoresCorrigidos.push(...trabalhador.nome.map(nome => ({ nome })));
        } else if (trabalhador.nome && trabalhador.nome.trim() !== '') {
          trabalhadoresCorrigidos.push(trabalhador);
        }
      });
      const trabalhadores = trabalhadoresCorrigidos;
      const novoServico = new Servico({ ...servicoData, proprietario: req.session.userId, produtos, trabalhadores });
      await novoServico.save();
    }
    res.redirect('/servicos');
  } catch (error) {
    res.redirect('/adicionar-servico?error=true');
  }
});

router.get('/detalhes/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servico = await Servico.findOne({ _id: req.params.id, proprietario: req.session.userId });
    if (!servico) return res.redirect('/servicos');
    
    res.render('detalhes', { servico: servico, servicosMap: servicosMap });

  } catch (error) {
    next(error);
  }
});

router.get('/editar/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servico = await Servico.findOne({ _id: req.params.id, proprietario: req.session.userId });
    if (!servico) return res.redirect('/servicos');
    res.render('editar', { servico });
  } catch (error) {
    next(error);
  }
});

router.post('/editar/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const { servicos } = req.body;
    const dadosAtualizados = servicos ? servicos[0] : null;

    // Defesa contra dados inválidos
    if (!dadosAtualizados) {
      return res.status(400).send("Dados de edição inválidos.");
    }
    
    // CORREÇÃO 1: Verifica se o serviço existe ANTES de tentar atualizar
    const servicoExistente = await Servico.findOne({ _id: req.params.id, proprietario: req.session.userId });
    if (!servicoExistente) {
      return res.status(404).send("Serviço não encontrado para atualização.");
    }
    
    // Filtra produtos para remover entradas vazias
    dadosAtualizados.produtos = (dadosAtualizados.produtos || []).filter(p => p && p.nome && p.nome.trim() !== '');
    
    // CORREÇÃO 2: Lógica de filtragem de trabalhadores mais robusta
    let trabalhadoresCorrigidos = [];
    if (Array.isArray(dadosAtualizados.trabalhadores)) {
  dadosAtualizados.trabalhadores.forEach(trabalhador => {
    if (!trabalhador || !trabalhador.nome) return;

    if (Array.isArray(trabalhador.nome)) {
      trabalhador.nome.forEach(nome => {
        if (typeof nome === 'string' && nome.trim() !== '') {
          trabalhadoresCorrigidos.push({ nome: nome.trim() });
        }
      });
    } else if (typeof trabalhador.nome === 'string' && trabalhador.nome.trim() !== '') {
      trabalhadoresCorrigidos.push({ nome: trabalhador.nome.trim() });
    }
  });
}
    dadosAtualizados.trabalhadores = trabalhadoresCorrigidos;

    // Atualiza o serviço no banco de dados
    await Servico.updateOne({ _id: req.params.id }, dadosAtualizados, { runValidators: true });
    
    res.redirect(`/detalhes/${req.params.id}`);
  } catch (error) {
    res.redirect(`/editar/${req.params.id}?error=true`);
  }
});

router.post('/excluir/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const resultado = await Servico.findOneAndDelete({ _id: req.params.id, proprietario: req.session.userId });
    if (!resultado) return res.redirect('/servicos');
    res.redirect('/servicos');
  } catch (error) {
    next(error);
  }
});

module.exports = router;