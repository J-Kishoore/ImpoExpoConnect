const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminViewDashboard() {
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

    await driver.executeScript('window.scrollTo(0,9)');
    await driver.executeScript('window.scrollTo(0,11)');

    el = await driver.wait(until.elementLocated(By.css('.grid:nth-child(3)')), 10000);
    await el.click();

    console.log('adminViewDashboard completed ✅');
  } catch (err) {
    console.error('adminViewDashboard failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
