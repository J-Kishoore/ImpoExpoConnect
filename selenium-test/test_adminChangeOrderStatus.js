const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminChangeOrderStatus() {
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

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(5)')), 10000);
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.border-\\[\\#1e5c3a\\] > .text-xs:nth-child(3)')),
      10000
    );
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex:nth-child(1)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.bg-card:nth-child(1)')), 10000);
    await el.click();

    console.log('adminChangeOrderStatus completed ✅');
  } catch (err) {
    console.error('adminChangeOrderStatus failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
