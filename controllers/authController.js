// controllers/authController.js
const mockUser = {
  email: 'teste@emater.com',
  senha: '123' 
};


exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (email === mockUser.email && senha === mockUser.senha) {
    req.session.user = { email: mockUser.email }; // Armazena informações do usuário na sessão
    
    res.redirect('/servicos');
  } else {
    res.redirect('/login?error=1');
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  res.redirect('/login');
};