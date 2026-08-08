const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminChangeOrderStatus() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.relative > .lucide')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(4)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(5)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.gap-1\\.5')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.gap-1\\.5:nth-child(2)')), 10000);
    await el.click();

    console.log('adminChangeOrderStatus completed ✅');
  } catch (err) {
    console.error('adminChangeOrderStatus failed ❌', err);
  }

})();
