Feature: Gerenciamento de tarefas
  As um usuário do sistema
  Quero poder adicionar, visualizar, remover e marcar tarefas como concluídas
  Para que eu possa organizar melhor minhas atividades diárias

  Scenario: Adicionar uma nova tarefa
    Given que estou na página de tarefas
    When eu escrevo "Estudar BDD" no campo de texto
    And clico no botão "Adicionar"
    Then vejo "Estudar BDD" na lista de tarefas

  # Scenario: Adicionar múltiplas tarefas
  #   Given que estou na página de tarefas
  #   When eu adiciono as tarefas "Comprar pão", "Ler artigo", "Fazer exercícios"
  #   Then vejo todas as tarefas na lista

  # Scenario: Marcar uma tarefa como concluída
  #   Given que estou na página de tarefas
  #   And eu adiciono a tarefa "Revisar código"
  #   When eu marco a tarefa "Revisar código" como concluída
  #   Then a tarefa "Revisar código" deve aparecer como concluída

  # Scenario: Remover uma tarefa da lista
  #   Given que estou na página de tarefas
  #   And eu adiciono a tarefa "Apagar tarefas antigas"
  #   When eu removo a tarefa "Apagar tarefas antigas"
  #   Then a tarefa "Apagar tarefas antigas" não deve estar na lista

  Scenario: Adicionar uma tarefa vazia
    Given que estou na página de tarefas
    When eu deixo o campo de texto vazio
    And clico no botão "Adicionar"
    Then não vejo nenhuma nova tarefa na lista

  # Scenario: Ver tarefas previamente adicionadas
  #   Given que tenho tarefas salvas "Estudar Node.js" e "Preparar aula"
  #   When eu acesso a página de tarefas
  #   Then vejo "Estudar Node.js" e "Preparar aula" na lista

  # Scenario: Editar o texto de uma tarefa existente
  #   Given que estou na página de tarefas
  #   And eu adiciono a tarefa "Estudar"
  #   When eu edito a tarefa "Estudar" para "Estudar testes automatizados"
  #   Then vejo "Estudar testes automatizados" na lista
  #   And não vejo "Estudar"