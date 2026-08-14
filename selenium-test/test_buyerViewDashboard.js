const { Builder, By, until, Key } = require('selenium-webdriver');
require('chromedriver');

(async function buyerViewDashboard() {
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
    await passwordInput.click();
    // Recorder captured a typo password + Enter (failed login attempt),
    // then re-clicked and entered the correct password below.
    await passwordInput.sendKeys('foocorner123');
    await passwordInput.sendKeys(Key.ENTER);

    passwordInput = await driver.wait(until.elementLocated(By.id('buyer-login-password')), 10000);
    await passwordInput.click();
    await passwordInput.sendKeys('foodcorner123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('div:nth-child(2) > .h-full')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.text-white\\/60:nth-child(1)')), 10000);
    await el.click();

    console.log('buyerViewDashboard completed ✅');
  } catch (err) {
    console.error('buyerViewDashboard failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
