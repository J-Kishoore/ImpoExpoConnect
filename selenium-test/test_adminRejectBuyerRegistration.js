const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function adminRejectBuyerRegistration() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.p-2')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.flex-1 > .w-full:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(1) .p-1\\.5:nth-child(1) path')),
      10000
    );
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.bg-\\[\\#edeae3\\]')), 10000);
    await el.click();

    el = await driver.wait(
      until.elementLocated(By.css('.hover\\3A bg-\\[\\#faf9f7\\]:nth-child(1) .p-1\\.5:nth-child(3) > .lucide')),
      10000
    );
    await el.click();

    // Confirm the delete confirmation dialog
    let alert = await driver.wait(until.alertIsPresent(), 10000);
    let alertText = await alert.getText();
    if (alertText !== 'Delete Vito Pizza? This cannot be undone.') {
      throw new Error(`Unexpected alert text: "${alertText}"`);
    }
    await alert.accept();

    el = await driver.wait(until.elementLocated(By.css('.absolute')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.absolute')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    let body = await driver.findElement(By.css('body'));
    await driver.actions({ bridge: true }).move({ origin: body, x: 0, y: 0 }).perform();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(1) .text-\\[10px\\]')), 10000);
    await el.click();

    console.log('adminRejectBuyerRegistration completed ✅');
  } catch (err) {
    console.error('adminRejectBuyerRegistration failed ❌', err);
  }
  
})();
