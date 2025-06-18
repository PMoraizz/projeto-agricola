const TaskService = require('../src/taskService');

// Feature: Gerenciamento de tarefas
describe('Gerenciamento de Tarefas', () => {
  let taskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  // Scenario: Adicionar uma nova tarefa
  describe('Adicionar tarefa', () => {
    it('deve adicionar uma nova tarefa à lista', () => {
      const descricao = 'Estudar BDD';
      const tarefa = taskService.addTask(descricao);
      const tarefas = taskService.listTasks();

      expect(tarefas).toHaveLength(1);
      expect(tarefas[0]).toMatchObject({
        description: 'Estudar BDD',
        completed: false
      });

      expect(tarefa.id).toBeDefined();
    });

    // Scenario: Adicionar uma tarefa vazia
    it('deve lançar erro ao adicionar uma tarefa vazia', () => {
      expect(() => taskService.addTask('')).toThrow('Descrição inválida');
      expect(() => taskService.addTask('   ')).toThrow('Descrição inválida');
      expect(() => taskService.addTask(null)).toThrow('Descrição inválida');
    });
  });
});