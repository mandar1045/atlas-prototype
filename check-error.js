const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  try {
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'dashboard-test.png' });
    console.log("Page loaded successfully.");
  } catch (e) {
    console.log("Error loading page:", e);
  }

  await browser.close();
})();
