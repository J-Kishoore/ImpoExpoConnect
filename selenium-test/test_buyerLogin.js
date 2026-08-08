const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerLogin() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.text-\\[\\#1c1917\\]')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('buyer-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('buyer-login-password')), 10000);
    await passwordInput.sendKeys('foodcorner123');

    let submitBtn = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await submitBtn.click();

    console.log('buyerLogin completed ✅');
  } catch (err) {
    console.error('buyerLogin failed ❌', err);
  }

})();
