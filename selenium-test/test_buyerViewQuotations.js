const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerViewQuotations() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(5)')), 10000);
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(1) > .px-4:nth-child(2)')),
      10000
    );
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(2) > .px-4:nth-child(2)')),
      10000
    );
    await el.click();

    console.log('buyerViewQuotations completed ✅');
  } catch (err) {
    console.error('buyerViewQuotations failed ❌', err);
  }

})();
