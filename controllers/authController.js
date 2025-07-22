const Usuario = require('../models/Usuario');

// Em controllers/authController.js
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await Usuario.findOne({ username: email });
    if (!user || !(await user.comparePassword(senha))) {
      // 1. Define a mensagem de erro na sessão flash
      req.flash('error', 'E-mail ou senha inválidos.'); 
      // 2. Redireciona sem o parâmetro de URL
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    res.redirect('/servicos');

  } catch (error) {
    req.flash('error', 'Ocorreu um erro no servidor.');
    res.redirect('/login');
  }
};


exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
};