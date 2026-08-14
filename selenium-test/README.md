# Selenium WebDriver (JS) — converted test suite (v2)

Converted from the Selenium IDE / pytest Python exports in `New.zip`. Each
`.py` file maps 1:1 to a `.js` file of the same base name.

## Setup

```bash
npm install
```

Requires Google Chrome installed locally (chromedriver is pinned to a recent
Chrome-compatible version — adjust the version in `package.json` if it
doesn't match your local Chrome).

## Running a test

```bash
node test_buyerRegistration.js
```

or via the npm scripts, e.g. `npm run test:buyerRegistration`.

## Conversion notes

- **Browser lifecycle**: as before, none of these scripts call
  `driver.quit()`. All `self.driver.close()` calls — both at the end of a
  script and, in a couple of files, mid-script — were dropped so the
  browser stays open until you close it manually or kill the Node process.
  `test_adminRejectBuyerRegistration.js` and `test_adminSendQuotation.js`
  each had a `close()` call in the *middle* of the original Python script,
  followed by more commands on the same driver — this only worked in the
  original because Selenium reused the already-open window/tab. Removing
  the close() calls here doesn't change the rest of the flow.
- **Explicit waits**: every `find_element` became
  `driver.wait(until.elementLocated(...), 10000)` before interacting.
- **Hover** (`ActionChains.move_to_element`): converted to
  `driver.actions({ bridge: true }).move({ origin: element }).perform()`.
- **Click-and-hold / release** (`test_adminRejectBuyerRegistration.js`):
  converted to `.press()` / `.release()` on the Actions builder.
- **Keys.ENTER**: converted to `Key.ENTER` from `selenium-webdriver`
  (`test_adminAddProduct.js`, `test_buyerViewDashboard.js`).
- **Dropdown selection by visible text**: converted to
  `dropdown.findElement(By.xpath(".//option[. = '...']"))`, same as the
  first batch.
- **`window.scrollTo` calls**: carried over via `driver.executeScript(...)`.
- **Repeated intermediate `send_keys` calls on date fields**
  (`test_adminGenerateReport.js`): the recorder captured several
  partially-typed states while typing into the date input; these were kept
  verbatim rather than collapsed, to stay faithful to the original.
- **CSS selectors**: Tailwind/`:nth-child`-based selectors were carried
  over with identical escaping (e.g. `.gap-1\.5`, `.text-\[\#1c1917\]`,
  `.hover\3A bg-\[\#faf9f7\]`). These remain brittle — consider adding
  `data-testid` attributes for more stable locators long-term.

## Files

| Python                                    | JS                                       |
|--------------------------------------------|--------------------------------------------|
| test_adminAcceptBuyerRegistration.py       | test_adminAcceptBuyerRegistration.js       |
| test_adminAddCategory.py                   | test_adminAddCategory.js                   |
| test_adminAddProduct.py                    | test_adminAddProduct.js                    |
| test_adminChangeOrderStatus.py             | test_adminChangeOrderStatus.js             |
| test_adminGenerateReport.py                | test_adminGenerateReport.js                |
| test_adminRejectBuyerRegistration.py       | test_adminRejectBuyerRegistration.js       |
| test_adminSendQuotation.py                 | test_adminSendQuotation.js                 |
| test_adminViewDashboard.py                 | test_adminViewDashboard.js                 |
| test_adminViewNotifications.py             | test_adminViewNotifications.js             |
| test_buyerOrderTracking.py                 | test_buyerOrderTracking.js                 |
| test_buyerPlaceBulkOrderRequest.py         | test_buyerPlaceBulkOrderRequest.js         |
| test_buyerRegistration.py                  | test_buyerRegistration.js                  |
| test_buyerSearchProduct.py                 | test_buyerSearchProduct.js                 |
| test_buyerViewDashboard.py                 | test_buyerViewDashboard.js                 |
| test_buyerViewNotifications.py             | test_buyerViewNotifications.js             |
| test_buyerViewQuotations.py                | test_buyerViewQuotations.js                |
