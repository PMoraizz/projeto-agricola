const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/Usuario');

describe('Rotas de Serviços (Protegidas)', () => {
  let agent;
  let testUser;

  // Antes de cada teste neste arquivo, cria e loga um usuário
  beforeEach(async () => {
    // Cria o usuário
    testUser = new Usuario({ username: 'produtor_logado@email.com', password: 'senha123' });
    await testUser.save();

    // Cria um 'agente' do Supertest que mantém os cookies (simula um navegador logado)
    agent = request.agent(app);

    // Faz o login para obter o cookie de sessão
    await agent
      .post('/login')
      .send({ email: 'produtor_logado@email.com', senha: 'senha123' });
  });

  test('GET /servicos - Deve retornar a lista de serviços para um usuário autenticado', async () => {
    // Usa o agente (que já está logado) para fazer a requisição
    const response = await agent.get('/servicos');

    expect(response.statusCode).toBe(200);
    // Verifica se a página contém um texto esperado
    expect(response.text).toContain('Nenhum serviço cadastrado ainda.');
  });
  
  test('POST /adicionar-servico - Deve criar um novo serviço com sucesso', async () => {
    const servicoData = {
        servicos: [{
        data: '2025-08-15',
        talhao: 'Talhão Teste',
        // CORREÇÃO: Usando um valor que existe no seu formulário
        servico_tipo: ['rocada'], 
        valor_servico: 200,
        produtos: [],
        trabalhadores: [{ nome: 'Trabalhador Teste' }]
        }]
    };

    const response = await agent
        .post('/adicionar-servico')
        .send(servicoData);
        
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/servicos');
});
});