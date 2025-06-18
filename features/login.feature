# language: pt
Funcionalidade: Login do usuário
  Para acessar o sistema
  Como um usuário autenticado
  Quero fazer login com credenciais válidas

  Cenário: Login com sucesso
    Dado que o usuário está na tela de login
    Quando ele informa usuário "admin" e senha "123456"
    Então o sistema deve redirecionar para a página inicial