# Projeto de Gestão Agrícola - EMATER

![Logo](public/assets/logo_barra.png)

## Descrição

Este projeto é uma aplicação web desenvolvida para auxiliar produtores rurais na gestão de serviços e atividades em suas propriedades. A plataforma permite o cadastro, visualização, edição e exclusão de serviços agrícolas, associando-os a produtos utilizados e trabalhadores envolvidos.

O sistema foi construído com foco em uma experiência de usuário simples e direta, especialmente em dispositivos móveis, e possui um sistema de autenticação para garantir que cada produtor tenha acesso apenas aos seus próprios dados.

---

## Funcionalidades Principais

-   **Autenticação de Usuários**: Sistema seguro de registro e login para produtores, garantindo a privacidade dos dados.
-   **Cadastro de Serviços**: Formulário dinâmico para adicionar novos serviços, permitindo associar múltiplos produtos e trabalhadores a cada atividade.
-   **Listagem e Visualização**: Tela principal que exibe todos os serviços cadastrados pelo produtor logado, com opções de filtro.
-   **Detalhes do Serviço**: Visualização completa de um serviço específico, com todas as informações de data, talhão, produtos e trabalhadores.
-   **Edição e Exclusão**: Funcionalidades completas de CRUD, permitindo que o produtor atualize ou remova serviços cadastrados, com uma janela de confirmação para exclusões.
-   **Testes Automatizados**: Conjunto de testes de aceitação (BDD) com Cucumber para garantir a estabilidade e o correto funcionamento das principais funcionalidades (ex: login).

---

## Tecnologias Utilizadas

-   **Backend**: Node.js, Express.js
-   **Banco de Dados**: MongoDB com Mongoose
-   **Frontend**: Jade (Pug) para renderização de views
-   **Autenticação**: Gerenciamento de sessão com `express-session` e criptografia de senhas com `bcrypt`.
-   **Testes**: Cucumber, Selenium WebDriver, Chai

---

## Como Iniciar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 16 ou superior)
-   [MongoDB](https://www.mongodb.com/try/download/community) instalado e rodando localmente na porta padrão (`27017`).

### Instalação

1.  Clone o repositório para a sua máquina local:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd projeto-agricola
    ```
3.  Instale todas as dependências do projeto:
    ```bash
    npm install
    ```

### Rodando a Aplicação

1.  Para iniciar o servidor de desenvolvimento, execute o comando:
    ```bash
    npm start
    ```
2.  A aplicação estará disponível em `http://localhost:3000`. O servidor irá se conectar automaticamente ao banco de dados `agricola`.

---

## Como Rodar os Testes

O projeto está configurado com testes de aceitação automatizados usando Cucumber para simular o comportamento do usuário.

### Configuração do Ambiente de Teste

Os testes rodam em um ambiente isolado e utilizam um banco de dados separado chamado `agricola_teste` para não interferir com seus dados de desenvolvimento.

### Executando os Testes

Para rodar os testes, você precisará de **dois terminais** abertos na pasta do projeto.

1.  **Terminal 1: Iniciar o Servidor em Modo de Teste**
    Execute o comando abaixo para iniciar a aplicação conectada ao banco de dados de teste:
    ```bash
    npm run start:test
    ```
    Você verá uma mensagem confirmando a conexão ao banco em modo de teste. Mantenha este terminal rodando.

2.  **Terminal 2: Executar os Testes**
    Com o servidor de teste rodando, execute o Cucumber com o seguinte comando:
    ```bash
    npm test
    ```
    Isso iniciará o Selenium, que abrirá uma janela do Chrome, executará as ações descritas nos cenários de teste e exibirá os resultados no terminal.
