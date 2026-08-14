const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminGenerateReport() {
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

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(7)')), 10000);
    await el.click();

    // Select report type from dropdown by visible text
    let dropdown = await driver.wait(until.elementLocated(By.id('admin-reports-type')), 10000);
    let option = await dropdown.findElement(By.xpath(".//option[. = 'Buyer Activity']"));
    await option.click();

    el = await driver.wait(until.elementLocated(By.css('option:nth-child(3)')), 10000);
    await el.click();

    // From-date: recorder captured several intermediate typed states — preserved as-is
    let fromDateInput = await driver.wait(until.elementLocated(By.id('admin-reports-from-date')), 10000);
    await fromDateInput.click();
    await fromDateInput.sendKeys('2025-06-01');
    await fromDateInput.sendKeys('2026-06-01');
    await fromDateInput.sendKeys('2026-07-01');
    await fromDateInput.sendKeys('2026-08-01');
    await fromDateInput.sendKeys('2026-09-01');
    await fromDateInput.sendKeys('2026-08-01');

    el = await driver.wait(until.elementLocated(By.css('.gap-2:nth-child(3)')), 10000);
    await el.click();

    // To-date: same pattern
    let toDateInput = await driver.wait(until.elementLocated(By.id('admin-reports-to-date')), 10000);
    await toDateInput.click();
    await toDateInput.sendKeys('2025-06-21');
    await toDateInput.sendKeys('2026-06-21');
    await toDateInput.sendKeys('2026-07-21');
    await toDateInput.sendKeys('2026-08-21');
    await toDateInput.sendKeys('2026-09-21');

    el = await driver.wait(until.elementLocated(By.css('.p-5')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.py-2')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.py-1\\.5:nth-child(1)')), 10000);
    await el.click();

    console.log('adminGenerateReport completed ✅');
  } catch (err) {
    console.error('adminGenerateReport failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
