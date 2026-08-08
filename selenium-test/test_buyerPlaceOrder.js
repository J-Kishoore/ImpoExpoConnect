const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function buyerPlaceOrder() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await el.click();

    el = await driver.wait(until.elementLocated(By.css('.hidden > .inline-flex')), 10000);
    await driver.actions({ bridge: true }).move({ origin: el }).perform();

    el = await driver.wait(until.elementLocated(By.css('.gap-1\\.5')), 10000);
    await el.click();

    // Select product from dropdown by visible text
    let dropdown = await driver.wait(until.elementLocated(By.id('buyer-order-form-product')), 10000);
    let option = await dropdown.findElement(By.xpath(".//option[. = 'Dhal — Rs.520 per kg (min 50)']"));
    await option.click();

    el = await driver.wait(
      until.elementLocated(By.css('#buyer-order-form-product > option:nth-child(2)')),
      10000
    );
    await el.click();

    // Quantity field: several edits, some preceded by a double-click to select-all
    let qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await qtyInput.sendKeys('50');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await qtyInput.sendKeys('51');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await driver.actions({ bridge: true }).doubleClick(qtyInput).perform();

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.sendKeys('52');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await qtyInput.sendKeys('53');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await driver.actions({ bridge: true }).doubleClick(qtyInput).perform();

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.sendKeys('54');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await qtyInput.sendKeys('55');

    qtyInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-qty')), 10000);
    await qtyInput.click();
    await driver.actions({ bridge: true }).doubleClick(qtyInput).perform();

    let portInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-delivery-port')), 10000);
    await portInput.click();
    await portInput.sendKeys('Fort Station');

    let dateInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-shipment-date')), 10000);
    await dateInput.click();
    dateInput = await driver.wait(until.elementLocated(By.id('buyer-order-form-shipment-date')), 10000);
    await dateInput.click();
    await dateInput.sendKeys('2026-08-25');

    let tradeTermSelect = await driver.wait(until.elementLocated(By.id('buyer-order-form-trade-term')), 10000);
    await tradeTermSelect.click();
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
    await qualitySpecInput.sendKeys('Grade A, washed dhal');

    el = await driver.wait(until.elementLocated(By.css('.inline-flex')), 10000);
    await el.click();

    console.log('buyerPlaceOrder completed ✅');
  } catch (err) {
    console.error('buyerPlaceOrder failed ❌', err);
  }

})();
