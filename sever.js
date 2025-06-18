// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Para entender JSON no corpo das requisições
app.use(express.static('public')); // Para servir os arquivos HTML, CSS, etc.

// --- Conexão com o MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// --- Modelos de Dados (Schemas) ---

// Modelo de Usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Modelo de Serviço
const ServiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, required: true },
    talhao: { type: String, required: true },
    servico: { type: String, required: true },
    num_servicos: { type: Number, required: true },
    valor_servico: { type: Number, required: true },
    nome_produto: String,
    qtde_produto: Number,
    unidade_produto: String,
    trabalhador: { type: String, required: true },
}, { timestamps: true });
const Service = mongoose.model('Service', ServiceSchema);

// --- Middleware de Autenticação ---
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona o payload do token (ex: { id: '...' }) à requisição
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

// --- Rotas da API ---

// Rota para registrar um novo usuário (para testes)
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});


// Rota de Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email ou senha inválidos' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Email ou senha inválidos' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Rota para ADICIONAR um serviço (Protegida)
app.post('/api/servicos', authMiddleware, async (req, res) => {
    try {
        const newService = new Service({ ...req.body, userId: req.user.id });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao salvar serviço', error: error.message });
    }
});

// Rota para LISTAR os serviços (Protegida)
app.get('/api/servicos', authMiddleware, async (req, res) => {
    try {
        const services = await Service.find({ userId: req.user.id }).sort({ data: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar serviços' });
    }
});


// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});