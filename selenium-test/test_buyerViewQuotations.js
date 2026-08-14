const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerViewQuotations() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 862 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.text-\\[\\#1c1917\\]')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('buyer-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('buyer-login-password')), 10000);
    await passwordInput.sendKeys('foodcorner123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(5) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.bg-white\\/10')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(1) > .px-4:nth-child(3)')),
      10000
    );
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(1) .p-1\\.5:nth-child(1) > .lucide')),
      10000
    );
    await el.click();

    console.log('buyerViewQuotations completed ✅');
  } catch (err) {
    console.error('buyerViewQuotations failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
