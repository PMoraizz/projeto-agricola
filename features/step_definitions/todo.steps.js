const { Given, When, Then } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

let browser;
let page;

// Scenario: Adicionar uma nova tarefa
Given('que estou na página de tarefas', async () => {
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // pode ser false para ver o navegador - os outros argumentos são para funcionar o GitHub Actions
  page = await browser.newPage();
  await page.goto('http://localhost:3000'); // substitua pela URL correta da sua aplicação
  await new Promise(resolve => setTimeout(resolve, 1000)); // espera 3 segundos
});

When('eu escrevo {string} no campo de texto', async (texto) => {
  await page.type('#task-input', texto); // certifique-se que o campo tem esse id
  await new Promise(resolve => setTimeout(resolve, 3000)); // espera 3 segundos
});

When('clico no botão {string}', async (btnText) => {
  await page.click('#add-task'); // certifique-se que o botão tem esse id
  await new Promise(resolve => setTimeout(resolve, 3000)); // espera 3 segundos
});

Then('vejo {string} na lista de tarefas', async (textoEsperado) => {
  const tarefas = await page.$$eval('.task-item', elementos =>
    elementos.map(el => el.textContent)
  );
  assert.ok(
    tarefas.includes(textoEsperado),
    `Esperava encontrar "${textoEsperado}" na lista, mas encontrei: [${tarefas.join(', ')}]`
  );
  await browser.close();
});


// Scenario: Adicionar uma tarefa vazia
// Não precisa colocar o Given, já que acima considera a página aberta

When('eu deixo o campo de texto vazio', async () => {
  const input = await page.$('#task-input');
  await input.click({ clickCount: 3 }); // seleciona tudo
  await page.keyboard.press('Backspace'); // apaga
});

Then('não vejo nenhuma nova tarefa na lista', async () => {
  const tarefas = await page.$$eval('.task-item', items => items.length);
  if (tarefas !== 0) {
    throw new Error(`Esperava nenhuma tarefa, mas encontrei ${tarefas}`);
  }
  await browser.close();
});
