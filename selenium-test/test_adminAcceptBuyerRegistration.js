const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminAcceptBuyerRegistration() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.h-16')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.sendKeys('himani123');

    let submitBtn = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await submitBtn.click();

    // Hover over the notification/registration card
    el = await driver.wait(until.elementLocated(By.css('.p-3')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    // Hover over the action icon
    el = await driver.wait(until.elementLocated(By.css('.relative path:nth-child(2)')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.relative path:nth-child(2)')), 10000);
    await el.click();

    // Reset mouse position to top-left of body
    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.bg-amber-50')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.lucide-circle-check-big')), 10000);
    await el.click();

    console.log('adminAcceptBuyerRegistration completed ✅');
  } catch (err) {
    console.error('adminAcceptBuyerRegistration failed ❌', err);
  }
  
})();
