const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminAddCategory() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 862 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.sendKeys('himani123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(4)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    let nameInput = await driver.wait(until.elementLocated(By.id('edit-category-name')), 10000);
    await nameInput.click();
    await nameInput.sendKeys('Vegetables');

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(1)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.pt-16')), 10000);
    await el.click();

    console.log('adminAddCategory completed ✅');
  } catch (err) {
    console.error('adminAddCategory failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
