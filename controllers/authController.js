const Usuario = require('../models/Usuario');

exports.login = async (req, res) => {
  
  const { email, senha } = req.body;
  
  
  console.log(`--- Tentativa de Login ---`);
  console.log(`Email recebido: ${email}`);
  console.log(`Senha recebida: ${senha}`);

  try {
    
    const user = await Usuario.findOne({ username: email });
    
    if (!user) {
      console.log('Resultado: Usuário não encontrado.');
      return res.redirect('/login?error=true');
    }

    
    const isMatch = await user.comparePassword(senha);

    console.log(`Resultado da comparação de senhas: ${isMatch}`);

    if (isMatch) {
      console.log('Login bem-sucedido!');
      req.session.userId = user._id;
      res.redirect('/servicos');
    } else {
      console.log('Resultado: Senhas não batem.');
      res.redirect('/login?error=true');
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.redirect('/login?error=true');
  }
};


exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
};