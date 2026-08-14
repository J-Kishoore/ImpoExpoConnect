const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminAcceptBuyerRegistration() {
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
    await passwordInput.click();
    await passwordInput.sendKeys('himani123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.lucide-circle-check-big')), 10000);
    await el.click();

    console.log('adminAcceptBuyerRegistration completed ✅');
  } catch (err) {
    console.error('adminAcceptBuyerRegistration failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
