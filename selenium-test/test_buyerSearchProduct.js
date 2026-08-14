const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerSearchProduct() {
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

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(2) > .truncate')), 10000);
    await el.click();

    let searchInput = await driver.wait(until.elementLocated(By.name('catalog-search')), 10000);
    await searchInput.click();
    await searchInput.sendKeys('Big onions');

    el = await driver.wait(until.elementLocated(By.css('.text-\\[\\#1e5c3a\\]')), 10000);
    await el.click();

    console.log('buyerSearchProduct completed ✅');
  } catch (err) {
    console.error('buyerSearchProduct failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
