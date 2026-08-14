const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminRejectBuyerRegistration() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 862 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await el.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    // Recorder captured a typo here (comma instead of dot) followed by a
    // click-and-hold / release, presumably to select the text before
    // retyping it correctly below.
    await emailInput.sendKeys('h.kaushi49@gmail,com');

    emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await driver.actions({ bridge: true }).move({ origin: emailInput }).press().perform();

    emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await driver.actions({ bridge: true }).move({ origin: emailInput }).perform();

    emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await driver.actions({ bridge: true }).move({ origin: emailInput }).release().perform();

    emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    let passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.click();

    // NOTE: the original script called self.driver.close() here, then kept
    // issuing commands on the same driver (re-doing the login flow). Per
    // your preference the browser stays open throughout, so that close()
    // call is omitted — it would have broken the rest of the script anyway
    // since nothing switched back to a window afterward.

    el = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await el.click();

    emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.sendKeys('himani123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(2) .p-1\\.5:nth-child(2) > .lucide')),
      10000
    );
    await el.click();

    console.log('adminRejectBuyerRegistration completed ✅');
  } catch (err) {
    console.error('adminRejectBuyerRegistration failed ❌', err);
  }
  // Browser intentionally left open — close manually when done.
})();
