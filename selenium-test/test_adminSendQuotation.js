const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminSendQuotation() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 862 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.text-white\\/50:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.text-white\\/50:nth-child(2)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    // NOTE: the original script called self.driver.close() here, then kept
    // issuing commands on the same driver (starting the admin login flow).
    // Per your preference the browser stays open throughout, so that
    // close() call is omitted.

    el = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.click();
    await passwordInput.sendKeys('himani123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(5)')), 10000);
    await el.click();

    let amountInput = await driver.wait(until.elementLocated(By.name('quoteAmount')), 10000);
    await amountInput.click();
    await amountInput.sendKeys('10000');

    el = await driver.wait(until.elementLocated(By.css('.gap-1\\.5')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(1)')), 10000);
    await el.click();

    console.log('adminSendQuotation completed ✅');
  } catch (err) {
    console.error('adminSendQuotation failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
