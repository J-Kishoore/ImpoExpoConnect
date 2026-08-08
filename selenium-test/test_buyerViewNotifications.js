const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerViewNotifications() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(7) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(1) .text-\\[10px\\]')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(7)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.rounded-md:nth-child(2)')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.inline-flex')), 10000);
    await el.click();

    console.log('buyerViewNotifications completed ✅');
  } catch (err) {
    console.error('buyerViewNotifications failed ❌', err);
  }

})();
