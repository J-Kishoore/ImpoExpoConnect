const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerRegistration() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 862 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.text-\\[\\#1c1917\\]')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.text-xs > .text-\\[\\#1e5c3a\\]')), 10000);
    await el.click();

    let companyNameInput = await driver.wait(
      until.elementLocated(By.id('buyer-register-company-name')),
      10000
    );
    await companyNameInput.click();
    await companyNameInput.sendKeys('Kamal super');

    let contactNameInput = await driver.wait(
      until.elementLocated(By.id('buyer-register-contact-name')),
      10000
    );
    await contactNameInput.click();
    await contactNameInput.sendKeys('Kamal Perera');

    let emailInput = await driver.wait(until.elementLocated(By.id('buyer-register-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('kamalsuper@gmail.com');

    let countryInput = await driver.wait(until.elementLocated(By.id('buyer-register-country')), 10000);
    await countryInput.sendKeys('Sri Lanka');

    let phoneInput = await driver.wait(until.elementLocated(By.id('buyer-register-phone')), 10000);
    await phoneInput.click();
    await phoneInput.sendKeys('074156895');

    let passwordInput = await driver.wait(until.elementLocated(By.id('buyer-register-password')), 10000);
    await passwordInput.click();
    await passwordInput.sendKeys('Kamal@123');

    let confirmPasswordInput = await driver.wait(
      until.elementLocated(By.id('buyer-register-confirm-password')),
      10000
    );
    await confirmPasswordInput.click();
    await confirmPasswordInput.sendKeys('Kamal@123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    console.log('buyerRegistration completed ✅');
  } catch (err) {
    console.error('buyerRegistration failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
