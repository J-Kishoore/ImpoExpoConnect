const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver'); // or geckodriver if using Firefox

(async function adminLoginTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.manage().window().setRect({ width: 1246, height: 860 });
    await driver.get('http://localhost:5173/');

    let navBtn = await driver.wait(until.elementLocated(By.css('.px-3:nth-child(2)')), 10000);
    await navBtn.click();

    let emailInput = await driver.wait(until.elementLocated(By.id('admin-login-email')), 10000);
    await emailInput.click();
    await emailInput.sendKeys('h.kaushi49@gmail.com');

    // If admin-login-email is actually a contentEditable div, use this instead:
    // await driver.executeScript(
    //   "if(arguments[0].isContentEditable) { arguments[0].innerText = arguments[1]; }",
    //   emailInput,
    //   'h.kaushi49@gmail.com'
    // );

    let passwordInput = await driver.wait(until.elementLocated(By.id('admin-login-password')), 10000);
    await passwordInput.sendKeys('himani123');

    let submitBtn = await driver.wait(until.elementLocated(By.css('.px-6')), 10000);
    await submitBtn.click();

    console.log('adminLoginTest completed ✅');
  } catch (err) {
    console.error('adminLoginTest failed ❌', err);
  }
  
})();
