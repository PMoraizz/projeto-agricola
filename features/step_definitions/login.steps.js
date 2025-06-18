// COM O CUCUMBER =============================================
// const { Given, When, Then } = require('@cucumber/cucumber');
// const assert = require('assert');

// const app = { estadoAtual: 'http://localhost:3000/login' };
// let redirecionado = false;

// // Carregar o contexo
// Given('que o usuário está na tela de login', () => {
//   assert.strictEqual(app.estadoAtual, 'http://localhost:3000/login');
// });

// // Executar a ação
// When('ele informa usuário {string} e senha {string}', (usuario, senha) => {
//   if(usuario == "admin" && senha == "123456"){
//     redirecionado = true;
//   } else {
//     redirecionado = false;
//   }
// });

// // Validar (assert)
// Then('o sistema deve redirecionar para a página inicial', () => {
//   assert.strictEqual(redirecionado, true);
// });

// COM O SELENIUM =============================================
// const { Given, When, Then, After } = require('@cucumber/cucumber');
// const { Builder, By, until } = require('selenium-webdriver');
// const assert = require('assert');

// let driver;

// Given('que o usuário está na tela de login', async () => {
//   driver = await new Builder().forBrowser('chrome').build();
//   await driver.get('http://localhost:3000/login');
// });

// When('ele informa usuário {string} e senha {string}', async (usuario, senha) => {
//   const inputUsuario = await driver.findElement(By.id('usuario'));
//   const inputSenha = await driver.findElement(By.id('senha'));
//   const botaoEntrar = await driver.findElement(By.id('entrar'));

//   await inputUsuario.sendKeys(usuario);
//   await inputSenha.sendKeys(senha);

//   await new Promise(resolve => setTimeout(resolve, 2000)); // espera 2 segundos

//   await botaoEntrar.click();
// });

// Then('o sistema deve redirecionar para a página inicial', async () => {
//   await driver.wait(until.urlContains('/'), 5000);
//   const texto = await driver.findElement(By.tagName('body')).getText();
//   assert.ok(texto.includes('Bem-vindo!'), 'Texto de boas-vindas não encontrado');
// });

// // Fecha o navegador após o teste
// After(async () => {
//   if (driver) {
//     await driver.quit();
//   }
// });