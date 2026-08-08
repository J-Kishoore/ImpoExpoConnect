const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerOrdertracking() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(4) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(2) > .text-xs:nth-child(2)')), 10000);
    await el.click();

    console.log('buyerOrdertracking completed ✅');
  } catch (err) {
    console.error('buyerOrdertracking failed ❌', err);
  }

})();
