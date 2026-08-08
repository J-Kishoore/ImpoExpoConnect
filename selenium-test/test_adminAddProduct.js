const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminAddProduct() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.p-2')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(3) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.bg-white\\/10')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(2)')), 10000);
    await el.click();

    let nameInput = await driver.wait(until.elementLocated(By.id('edit-product-name')), 10000);
    await nameInput.click();
    await nameInput.sendKeys('Dhal');

    el = await driver.wait(until.elementLocated(By.css('option')), 10000);
    await el.click();

    let minOrderInput = await driver.wait(until.elementLocated(By.id('edit-product-min-order')), 10000);
    await minOrderInput.click();
    await minOrderInput.sendKeys('50');

    let priceInput = await driver.wait(until.elementLocated(By.id('edit-product-price')), 10000);
    await priceInput.click();
    await priceInput.sendKeys('Rs.520 per kg');

    el = await driver.wait(until.elementLocated(By.css('.px-4:nth-child(1)')), 10000);
    await el.click();

    console.log('adminAddProduct completed ✅');
  } catch (err) {
    console.error('adminAddProduct failed ❌', err);
  }
  
})();
