const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerSearchProduct() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.h-16')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(2) > .truncate')), 10000);
    await el.click();

    let searchInput = await driver.wait(until.elementLocated(By.name('catalog-search')), 10000);
    await searchInput.click();
    await searchInput.sendKeys('dhal');

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\] > .px-4:nth-child(4)')),
      10000
    );
    await el.click();

    console.log('buyerSearchProduct completed ✅');
  } catch (err) {
    console.error('buyerSearchProduct failed ❌', err);
  }

})();
