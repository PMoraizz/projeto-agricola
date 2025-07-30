var express = require('express');
var router = express.Router();
var Servico = require('../models/Servico');

/*
 * ROTA DA API: GET /api/servicos
 * Retorna todos os serviços cadastrados no banco de dados em formato JSON.
 */
router.get('/servicos', async (req, res, next) => {
  try {
    // 1. Busca todos os serviços no banco de dados.
    // O .populate() é usado para substituir o ID do proprietário pelos dados reais do usuário.
    // O segundo argumento ('username') garante que apenas o nome de usuário seja retornado, por segurança.
    const todosServicos = await Servico.find({})
      .populate('proprietario', 'username')
      .sort({ data: -1 });

    // 2. Retorna os dados como uma resposta JSON.
    res.json(todosServicos);

  } catch (error) {
    // 3. Em caso de erro no banco, retorna um erro 500 (Erro Interno do Servidor).
    console.error("Erro ao buscar serviços para a API:", error);
    res.status(500).json({
      message: "Erro ao buscar os dados dos serviços.",
      error: error.message
    });
  }
});

module.exports = router;