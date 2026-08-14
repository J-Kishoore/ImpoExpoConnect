const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerPlaceBulkOrderRequest() {
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
    await passwordInput.sendKeys('foodcorner123');

    el = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.w-full:nth-child(3) > .truncate')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.id('buyer-order-form-product')), 10000);
    await el.click();

    // Select product from dropdown by visible text
    let dropdown = await driver.wait(until.elementLocated(By.id('buyer-order-form-product')), 10000);
    let option = await dropdown.findElement(By.xpath(".//option[. = 'Big Onions — 250 rupees per kg (min 20)']"));
    await option.click();

    el = await driver.wait(
      until.elementLocated(By.css('#buyer-order-form-product > option:nth-child(2)')),
      10000
    );
    await el.click();

    let qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await qtyInput.sendKeys('30');

    let portInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-delivery-port')), 10000);
    await portInput.click();
    await portInput.sendKeys('Fort Station');

    let dateInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-shipment-date')), 10000);
    await dateInput.click();
    dateInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-shipment-date')), 10000);
    await dateInput.click();
    dateInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-shipment-date')), 10000);
    await dateInput.click();
    await dateInput.sendKeys('2026-09-08');

    dropdown = await driver.wait(until.elementLocated(By.id('buyer-order-form-trade-term')), 10000);
    option = await dropdown.findElement(By.xpath(".//option[. = 'CIF Destination']"));
    await option.click();

    el = await driver.wait(
      until.elementLocated(By.css('#buyer-order-form-trade-term > option:nth-child(2)')),
      10000
    );
    await el.click();

    let qualitySpecInput = await driver.wait(
      until.elementLocated(By.id('buyer-order-form-quality-spec')),
      10000
    );
    await qualitySpecInput.click();
    await qualitySpecInput.sendKeys('Grade A not patched onions');

    el = await driver.wait(until.elementLocated(By.css('.inline-flex')), 10000);
    await el.click();

    console.log('buyerPlaceBulkOrderRequest completed ✅');
  } catch (err) {
    console.error('buyerPlaceBulkOrderRequest failed ❌', err);
  }
  // Original script closed this window (self.driver.close()) here.
  // Per your preference, the browser is intentionally left open instead —
  // close manually when done.
})();
