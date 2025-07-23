// const mongoose = require('mongoose');
// const dbHelper = require('../helpers/mongo-test-helper'); // Caminho corrigido
// const Servico = require('../../models/Servico');         // Caminho corrigido

// beforeEach(async () => {
//   await Servico.deleteMany({});
// });

// describe('Modelo de Serviço (Testes Unitários)', () => {

//   describe('Validações do Schema', () => {
//     it('Deve salvar um serviço com todos os campos obrigatórios', async () => {
//       const servicoValido = new Servico({
//         proprietario: new mongoose.Types.ObjectId(),
//         data: new Date(),
//         talhao: 'Talhão Teste',
//         servico_tipo: ['teste'],
//         valor_servico: 100,
//       });
//       await expect(servicoValido.save()).resolves.toBeDefined();
//     });

//     it('Deve falhar se o campo "proprietario" não for fornecido', async () => {
//       const servicoInvalido = new Servico({
//         data: new Date(),
//         talhao: 'Talhão Teste',
//       });
//       await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
//     });
//   });
// });

const mongoose = require('mongoose');
const Servico = require('../../models/Servico');

beforeEach(async () => {
  await Servico.deleteMany({});
});

describe('Modelo de Serviço (Testes Unitários)', () => {

  describe('Validações do Schema', () => {
    it('Deve salvar um serviço com todos os campos obrigatórios', async () => {
      const servicoValido = new Servico({
        proprietario: new mongoose.Types.ObjectId(),
        data: new Date(),
        talhao: 'Talhão Teste',
        servico_tipo: ['teste'],
        valor_servico: 100,
      });
      await expect(servicoValido.save()).resolves.toBeDefined();
    });

    it('Deve falhar se o campo "proprietario" não for fornecido', async () => {
      const servicoInvalido = new Servico({
        data: new Date(),
        talhao: 'Talhão Teste',
      });
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
  });
});