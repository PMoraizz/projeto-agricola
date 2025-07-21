const mongoose = require('mongoose');


const produtoSchema = new mongoose.Schema({
  nome: String,
  qtde: Number, 
  unidade: String,
  valor: Number
});


const trabalhadorSchema = new mongoose.Schema({
  nome: String
});

const servicoSchema = new mongoose.Schema({
  data: Date,
  talhao: String,
  servico_tipo: [String],
  valor_servico: Number, 
  produtos: [produtoSchema],
  trabalhadores: [trabalhadorSchema]
});

module.exports = mongoose.model('Servico', servicoSchema);