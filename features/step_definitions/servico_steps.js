const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const Servico = require('../../models/Servico');
const Usuario = require('../../models/Usuario');

// --- Passos "Dado" (Given) ---

Given('que o produtor tem um serviço cadastrado com o tipo {string} no talhão {string}', async function (tipoServico, talhao) {
  const user = await Usuario.findOne({ username: this.testUser.username });
  if (!user) { throw new Error('Usuário de teste não encontrado.'); }
  
  await Servico.deleteMany({ proprietario: user._id });

  const novoServico = new Servico({
    proprietario: user._id, data: new Date(), talhao: talhao,
    servico_tipo: [tipoServico], valor_servico: 150,
    produtos: [{ nome: 'Adubo', qtde: 10, unidade: 'kg', valor: 25 }],
    trabalhadores: [{ nome: 'José' }]
  });
  await novoServico.save();
  this.servicoId = novoServico._id;
});

// --- Passos "Quando" (When) ---

When('eu vou para a página de serviços', async function () {
  await this.driver.get('http://localhost:3000/servicos');
});

When('eu vou para a página de {string}', async function (pageName) {
  const url = pageName === 'Adicionar Serviço' 
    ? 'http://localhost:3000/adicionar-servico'
    : 'http://localhost:3000/servicos';
  await this.driver.get(url);
});

When('eu preencho o formulário de serviço com dados válidos', {timeout: 20 * 1000}, async function () {
  const dateInput = await this.driver.findElement(By.css('input[type="date"]'));
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);
  await dateInput.sendKeys(futureDate.toISOString().split('T')[0]);
  
  await this.driver.findElement(By.id('talhao-0')).findElement(By.xpath("//option[text()='Sede']")).click();
  
  const selectBox = await this.driver.findElement(By.css('.select-box'));
  await selectBox.click();
  const checkboxContainer = await this.driver.findElement(By.id('servico-checkboxes-container-0'));
  const checkbox = await checkboxContainer.findElement(By.xpath("//label[contains(., 'Roçada')]/input"));
  await checkbox.click();
  await selectBox.click();
  
  const addTrabalhadorBtn = await this.driver.findElement(By.css('.add-trabalhador-btn'));
  await addTrabalhadorBtn.click();
  
  const novoTrabalhadorSelector = By.css('.trabalhadores-list .repeatable-item:last-child input[name*="[nome]"]');
  await this.driver.wait(until.elementIsVisible(this.driver.findElement(novoTrabalhadorSelector)), 10000);
  await this.driver.findElement(novoTrabalhadorSelector).sendKeys('João da Silva');
});

When('eu clico no serviço {string}', async function (servicoName) {
  const serviceCard = await this.driver.findElement(By.xpath(`//div[contains(@class, 'service-list')]//a[h3[contains(text(), '${servicoName}')]]`));
  await serviceCard.click();
});

When('eu clico no botão de excluir', async function () {
  const deleteButton = await this.driver.findElement(By.css('a.btn-excluir'));
  await deleteButton.click();
  await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('confirm-modal'))), 5000);
});

When('eu confirmo a exclusão', async function () {
  const confirmButton = await this.driver.findElement(By.css('#delete-form button[type="submit"]'));
  await confirmButton.click();
});

// --- Passos "Então" (Then) ---

// ======================= ESTE PASSO FOI CORRIGIDO =======================
Then('eu devo ver o serviço {string} na lista', async function (servicoName) {
  const serviceListSelector = By.css('.service-list');
  // 1. Espera a lista de serviços carregar
  await this.driver.wait(until.elementLocated(serviceListSelector), 10000);
  const serviceList = await this.driver.findElement(serviceListSelector);
  
  // 2. Espera até que um H3 com o texto (ignorando maiúsculas/minúsculas) apareça
  // A função translate() do XPath é perfeita para isso.
  const serviceTitleSelector = By.xpath(`//h3[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${servicoName.toLowerCase()}')]`);
  await this.driver.wait(until.elementLocated(serviceTitleSelector), 5000);

  // 3. Verificação final para garantir
  const listText = await serviceList.getText();
  expect(listText.toLowerCase()).to.include(servicoName.toLowerCase());
});
// ======================================================================

Then('eu não devo ver o serviço {string} na lista', async function (servicoName) {
  await this.driver.wait(until.urlContains('/servicos'), 5000);
  const pageSource = await this.driver.getPageSource();
  expect(pageSource.toLowerCase()).to.not.include(servicoName.toLowerCase());
});

Then('eu devo estar na página de detalhes do serviço', async function () {
  await this.driver.wait(until.urlContains(`/detalhes/${this.servicoId}`), 5000);
  const currentUrl = await this.driver.getCurrentUrl();
  expect(currentUrl).to.include('/detalhes/');
});

Then('eu devo ver o talhão {string}', async function (talhaoName) {
  const body = await this.driver.findElement(By.tagName('body'));
  await this.driver.wait(until.elementTextContains(body, talhaoName), 5000);
  const pageSource = await body.getText();
  expect(pageSource).to.include(talhaoName);
});