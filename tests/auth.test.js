const request = require('supertest');
const app = require('../app'); // Importa sua aplicação Express
const Usuario = require('../models/Usuario');

describe('Rotas de Autenticação', () => {
  // Teste de registro de um novo usuário
  test('POST /registrar - Deve criar um novo usuário e redirecionar para /login', async () => {
    const response = await request(app)
      .post('/registrar')
      .send({
        username: 'novo_usuario@email.com',
        password: 'senha_forte'
      });

    // Verifica se o redirecionamento está correto
    expect(response.statusCode).toBe(302); // 302 é o código para redirecionamento
    expect(response.headers.location).toBe('/login');

    // Verifica se o usuário foi realmente criado no banco de dados
    const user = await Usuario.findOne({ username: 'novo_usuario@email.com' });
    expect(user).not.toBeNull();
  });

  // Teste de login com sucesso
  test('POST /login - Deve autenticar um usuário existente e redirecionar para /servicos', async () => {
    // 1. Primeiro, cria um usuário no banco para poder testar o login
    const user = new Usuario({ username: 'usuario_existente@email.com', password: 'senha123' });
    await user.save();

    // 2. Agora, simula a requisição de login
    const response = await request(app)
      .post('/login')
      .send({
        email: 'usuario_existente@email.com',
        senha: 'senha123'
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/servicos');
  });
});