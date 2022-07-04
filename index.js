const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.yahoo.co.jp');
  await page.screenshot({ path: 'puppeteer_ss.png', fullPage: true });

  await browser.close();

})();
