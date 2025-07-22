# Projeto de Gestão Agrícola - EMATER

![Logo](public/assets/logo_barra.png)

## Descrição

Este projeto é uma aplicação web desenvolvida para auxiliar produtores rurais na gestão de serviços e atividades em suas propriedades. A plataforma permite o cadastro, visualização, edição e exclusão de serviços agrícolas, associando-os a produtos utilizados e trabalhadores envolvidos.

O sistema foi construído com foco em uma experiência de usuário simples e direta, especialmente em dispositivos móveis, e possui um sistema de autenticação para garantir que cada produtor tenha acesso apenas aos seus próprios dados.

---

## Funcionalidades Principais

-   **Autenticação de Usuários**: Sistema seguro de registro e login para produtores.
-   **Gestão de Serviços (CRUD)**: Funcionalidades completas de cadastro, visualização, edição e exclusão de serviços.
-   **Testes Automatizados**: O projeto conta com uma suíte completa de testes, incluindo:
    -   **Testes de Aceitação (BDD)** com Cucumber para validar o comportamento do sistema sob a perspectiva do usuário.
    -   **Testes de Integração** com Jest e Supertest para garantir a robustez e o correto funcionamento das rotas da API.

---

## Tecnologias Utilizadas

-   **Backend**: Node.js, Express.js
-   **Banco de Dados**: MongoDB com Mongoose
-   **Frontend**: Jade (Pug) para renderização de views
-   **Autenticação**: `express-session`, `bcrypt`, `connect-flash`
-   **Testes**:
    -   **Aceitação**: Cucumber, Selenium WebDriver, Chai
    -   **Integração**: Jest, Supertest

---

## Como Iniciar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 16 ou superior)
-   [MongoDB](https://www.mongodb.com/try/download/community) instalado e rodando localmente.
-   [Docker](https://www.docker.com/products/docker-desktop/) (opcional, para rodar em um contêiner).

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

### Rodando a Aplicação Localmente

1.  Para iniciar o servidor de desenvolvimento, execute o comando:
    ```bash
    npm start
    ```
2.  A aplicação estará disponível em `http://localhost:3000`.

### Rodando a Aplicação com Docker

Caso deseje rodar a aplicação em um ambiente isolado com Docker, utilize o comando abaixo na raiz do projeto:
```bash
docker-compose up --build
```
A aplicação estará disponível em `http://localhost:3000`.

---

## Como Rodar os Testes

O projeto possui dois tipos de testes automatizados. Ambos rodam em um ambiente isolado e utilizam um banco de dados separado chamado `agricola_teste`.

### 1. Testes de Integração (Jest)

Estes testes verificam as rotas da API diretamente, garantindo a lógica do backend. **São mais rápidos e ideais para verificações frequentes durante o desenvolvimento.**

1.  **Pré-requisito**: Certifique-se de que o MongoDB esteja rodando localmente.
2.  Execute o seguinte comando no terminal:
    ```bash
    npm run test:integration
    ```
    O Jest executará todos os testes de integração e exibirá um relatório de cobertura de código no final.

### 2. Testes de Aceitação (Cucumber)

Estes testes simulam o comportamento real de um usuário no navegador.

1.  **Terminal 1: Iniciar o Servidor em Modo de Teste**
    Execute o comando abaixo para iniciar a aplicação conectada ao banco de dados de teste:
    ```bash
    npm run start:test
    ```
    Mantenha este terminal rodando.

2.  **Terminal 2: Executar os Testes**
    Com o servidor de teste rodando, execute o Cucumber no segundo terminal:
    ```bash
    npm test
    ```
    Isso iniciará o Selenium, que abrirá uma janela do Chrome para executar as ações descritas nos cenários de teste.
