const { Given } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');

// Este passo assume que um usuário foi criado por um passo anterior (ex: "Dado que existe...")
Given('eu estou logado', async function () {
  await this.driver.get('http://localhost:3000/login');
  await this.driver.findElement(By.name('email')).sendKeys(this.testUser.username);
  await this.driver.findElement(By.name('senha')).sendKeys(this.testUser.password);
  const button = await this.driver.findElement(By.xpath("//button[contains(text(),'Iniciar Sessão')]"));
  await button.submit();
  // Espera até que o redirecionamento para a página de serviços seja concluído
  await this.driver.wait(until.urlContains('/servicos'), 5000);
});