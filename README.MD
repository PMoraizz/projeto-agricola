# Deploy

Projeto com o objetivo de revisar:
- Teste unitário
- Teste de aceitação
- Containerização
- Pipeline CI/CD

### Preparação do Ambiente

1. `npm install`
1. Comandos:
    - `npm start`: executar aplicação em modo de produção
    - `npm run dev`: executar aplicação em mode de desenvolvimento

### Passo 1: Definição de Requisitos com BDD

1. `npm i -D @cucumber/cucumber`
2. Acrescentar em `package.json`:
    ```json
    "scripts": {
        "test:acceptance": "cucumber-js"
    }
    ```
3. Criar o arquivo `cucumber.json` com o conteúdo:
    ```json
    {
        "default": {
            "formatOptions": {
                "snippetInterface": "synchronous"
            }
        }
    }
    ```
4. Criar a pasta `./features`
5. Criar um arquivo `.feature` que corresponda aos requisitos. Exemplo: `login.feature`

### Passo 2: Escrever os testes unitários e sua implementação

Recomenda-se usar TDD, ou seja, escrever os testes primeiros e depois a implementação.

1. `npm i -D jest`
2. Acrescentar em `package.json`:
    ```json
    "scripts": {
        "test:unit": "npx jest"
    }
    ```
3. Escrever os testes untiários antes da implementação.
4. Execute `npm test:unit`. Certamente nenhum teste passará.
5. Faça a implementação correspondente aos testes escritos.
6. Execute `npm test:unit`. Agora, os testes devem passar.

### Passo 3: Escrever os testes de aceitação e sua implementação

1. `npm i -D puppeteer` (O *puppeteer* é equivalente ao Selenium e é mantido pelo time do Chrome).
2. Crie o arquivo `.steps.js` em `./features/step_definitions`. Exemplo: `./features/step_definitions/todo.steps.js`
3. Faça a implementação correspondente aos testes escritos.
4. Execute `npm test:acceptance`.

**Dica!**

Para executar todos os testes, adicione isto ao `package.json`:
```json
"scripts": {
    "test": "npm run test:unit && npm run test:acceptance"
}
```

### Passo 4: Criar um container para o app

1. Crie o arquivo `docker-compose.yml`
2. Execute `docker-compose up -d`

### Passo 5: Criar um pipeline CI/CD

1. Crie a hierarquia de pastas `.github/workflows`
2. Crie o arquivo `.yml` com as configurações dentro da pasta
3. Configure o [https://vercel.com](Vercel) para implantar as modificações em produção após o GitHub Actions
    1. Crie o arquivo `./api/index.js`
        ```js
        var app = require('../app');
        module.exports = app;
        ```
    2. Crie o arquivo `./vercel.json`
        ```json
        {
        "version": 2,
        "builds": [
            { "src": "api/index.js", "use": "@vercel/node" }
        ],
        "routes": [
            { "src": "/(.*)", "dest": "api/index.js" }
        ]
        }
        ```
    3. Para funcionar corretamente o teste de aceitação no GitHub Actions, instale `npm i -D start-server-and-test`.
    4. Atualize `"test:acceptance": "cucumber-js"` para `"test:acceptance": "start-server-and-test start http://localhost:3311 cucumber-js"`.
    5. Atualize o `tests.yml` para que o teste de aceitação execute com sucesso no GitHub Actions. 
    6. Crie o arquivo `./Dockerfile` para que o `Puppeteer` funcione perfeitamente no GitHub Actions.
    7. Atualize o `docker-compose.yml` para reconhecer as configurações do `Dockerfile`.
4. Atualize o repostiório e verifique o status em GitHub Actions
