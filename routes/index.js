var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var Servico = require('../models/Servico'); 
var Usuario = require('../models/Usuario');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: req.query.error });
});

router.post('/login', authController.login);


router.get('/servicos', authController.isAuthenticated, async function(req, res, next) {
  try {
    
    const servicosDoUsuario = await Servico.find({ proprietario: req.session.userId }).sort({ data: -1 });
    
    
    res.render('servicos', { servicos: servicosDoUsuario });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    next(error); 
  }
});


router.get('/registrar', function(req, res) {
  res.render('registrar'); 
});

router.post('/registrar', async function(req, res) {
  try {
    const { username, password } = req.body;
    const novoUsuario = new Usuario({ username, password });
    await novoUsuario.save();
    res.redirect('/login');
  } catch (error) {
    
    res.redirect('/registrar?error=true');
  }
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
        
        servicoData.trabalhadores.forEach(trabalhador => {
          
          if (Array.isArray(trabalhador.nome)) {
            
            const nomesIndividuais = trabalhador.nome.map(nome => ({ nome: nome }));
            trabalhadoresCorrigidos.push(...nomesIndividuais);
          } else {
            
            trabalhadoresCorrigidos.push(trabalhador);
          }
        });
      }
      
      
      const trabalhadores = trabalhadoresCorrigidos.filter(t => t && t.nome && String(t.nome).trim() !== '');
      

      const novoServico = new Servico({
        proprietario: req.session.userId,
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

router.get('/detalhes/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servicoId = req.params.id;
    const userId = req.session.userId;

    
    const servico = await Servico.findOne({ _id: servicoId, proprietario: userId });

    if (!servico) {
      
      console.log('Serviço não encontrado ou não pertence ao usuário.');
      return res.redirect('/servicos');
    }

    
    res.render('detalhes', { servico: servico });

  } catch (error) {
    console.error("Erro ao buscar detalhes do serviço:", error);
    next(error);
  }
});



router.get('/editar/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servico = await Servico.findOne({ _id: req.params.id, proprietario: req.session.userId });

    if (!servico) {
      console.log('Serviço para edição não encontrado ou não pertence ao usuário.');
      return res.redirect('/servicos');
    }

    
    res.render('editar', { servico: servico });

  } catch (error) {
    console.error("Erro ao carregar a página de edição:", error);
    next(error);
  }
});


router.post('/editar/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servicoId = req.params.id;
    const userId = req.session.userId;
    
    
    const dadosAtualizados = req.body.servicos[0];

    
    let trabalhadoresCorrigidos = [];
    if (dadosAtualizados.trabalhadores && dadosAtualizados.trabalhadores.length > 0) {
      dadosAtualizados.trabalhadores.forEach(trabalhador => {
        if (Array.isArray(trabalhador.nome)) {
          trabalhadoresCorrigidos.push(...trabalhador.nome.map(nome => ({ nome })));
        } else if (trabalhador && trabalhador.nome) {
          trabalhadoresCorrigidos.push(trabalhador);
        }
      });
    }
    dadosAtualizados.trabalhadores = trabalhadoresCorrigidos.filter(t => t.nome && t.nome.trim() !== '');

    // Filtra produtos para remover entradas vazias
    if (dadosAtualizados.produtos) {
      dadosAtualizados.produtos = dadosAtualizados.produtos.filter(p => p && p.nome && p.nome.trim() !== '');
    }

    // Encontra o serviço pelo ID e ID do proprietário, e o atualiza.
    const servicoAtualizado = await Servico.findOneAndUpdate(
      { _id: servicoId, proprietario: userId }, 
      dadosAtualizados, 
      { new: true, runValidators: true } // Opções para retornar o doc atualizado e rodar validações
    );

    if (!servicoAtualizado) {
      return res.status(404).send("Serviço não encontrado para atualização.");
    }

    console.log('Serviço atualizado com sucesso!');
    // Redireciona de volta para a página de detalhes para ver as mudanças
    res.redirect(`/detalhes/${servicoId}`);

  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    // Em caso de erro, redireciona de volta para a página de edição
    res.redirect(`/editar/${req.params.id}?error=true`);
  }
});


// ROTA PARA EXCLUIR UM SERVIÇO (MÉTODO POST)
router.post('/excluir/:id', authController.isAuthenticated, async (req, res, next) => {
  try {
    const servicoId = req.params.id;
    const userId = req.session.userId;

    // findOneAndDelete é seguro: ele só deleta se o _id E o proprietario baterem.
    const resultado = await Servico.findOneAndDelete({ _id: servicoId, proprietario: userId });

    if (!resultado) {
      // Isso acontece se o serviço não foi encontrado ou não pertencia ao usuário
      console.log('Tentativa de exclusão falhou. Serviço não encontrado ou não pertence ao usuário.');
      // Você pode redirecionar para a lista com uma mensagem de erro, se quiser
      return res.redirect('/servicos');
    }

    console.log('Serviço excluído com sucesso!');
    // Após excluir, redireciona o usuário de volta para a lista de serviços.
    res.redirect('/servicos');

  } catch (error) {
    console.error("Erro ao excluir o serviço:", error);
    next(error);
  }
});

module.exports = router;
