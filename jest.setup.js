// const mongoose = require('mongoose');
// const Usuario = require('./models/Usuario');
// const Servico = require('./models/Servico');

// // Antes de todos os testes, conecta ao banco
// beforeAll(async () => {
//   const dbConnectionString = 'mongodb://localhost:27017/agricola_teste';
//   await mongoose.connect(dbConnectionString);
// });

// // Antes de CADA teste, limpa as coleções
// beforeEach(async () => {
//   await Usuario.deleteMany({});
//   await Servico.deleteMany({});
// });

// // DEPOIS de CADA teste, restaura todos os mocks (simulações de erro)
// afterEach(() => {
//   jest.restoreAllMocks();
// });

// // Depois de todos os testes, desconecta do banco
// afterAll(async () => {
//   await mongoose.connection.close();
// });

const mongoose = require('mongoose');

// Conecta ao banco ANTES que os testes comecem
beforeAll(async () => {
  const uri = process.env.MONGO_URI_UNIT_TESTS;
  await mongoose.connect(uri);
});

// Desconecta DEPOIS que todos os testes terminarem
afterAll(async () => {
  await mongoose.disconnect();
});