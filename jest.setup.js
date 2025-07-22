const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const Servico = require('./models/Servico');


beforeAll(async () => {
  const dbConnectionString = 'mongodb://localhost:27017/agricola_teste';
  await mongoose.connect(dbConnectionString);
});


beforeEach(async () => {
  await Usuario.deleteMany({});
  await Servico.deleteMany({});
});


afterAll(async () => {
  await mongoose.connection.close();
});