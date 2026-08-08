const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerViewDashboard() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    await driver.executeScript('window.scrollTo(0,0)');

    console.log('buyerViewDashboard completed ✅');
  } catch (err) {
    console.error('buyerViewDashboard failed ❌', err);
  }

})();
