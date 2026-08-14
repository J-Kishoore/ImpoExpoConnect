const { Builder, By, until, Key } = require('selenium-webdriver');
require('chromedriver');

(async function adminAddProduct() {
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

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(3)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(3) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(2)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    let nameInput = await driver.wait(until.elementLocated(By.id('edit-product-name')), 10000);
    await nameInput.click();
    await nameInput.sendKeys('Big Onions');

    // Select category from dropdown by visible text
    let dropdown = await driver.wait(until.elementLocated(By.id('edit-product-category')), 10000);
    let option = await dropdown.findElement(By.xpath(".//option[. = 'Vegetables']"));
    await option.click();

    el = await driver.wait(until.elementLocated(By.css('option:nth-child(3)')), 10000);
    await el.click();

    let minOrderInput = await driver.wait(until.elementLocated(By.id('edit-product-min-order')), 10000);
    await minOrderInput.click();
    await minOrderInput.sendKeys('20');

    let priceInput = await driver.wait(until.elementLocated(By.id('edit-product-price')), 10000);
    await priceInput.click();
    await priceInput.sendKeys('250 rupees per kg');
    await priceInput.sendKeys(Key.ENTER);

    el = await driver.wait(until.elementLocated(By.css('.bg-card:nth-child(1) > .mb-3 > .text-xs')), 10000);
    await el.click();

    console.log('adminAddProduct completed ✅');
  } catch (err) {
    console.error('adminAddProduct failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
