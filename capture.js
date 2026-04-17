const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // Load the local HTML file
  await page.goto('file:///sessions/focused-sharp-darwin/mnt/outputs/macromicro-ai.html', {
    waitUntil: 'networkidle'
  });

  // Wait for fonts to load
  await page.waitForTimeout(2000);

  // Make all animated elements visible (they start with opacity 0 for scroll animation)
  await page.evaluate(() => {
    document.querySelectorAll('.feature-card, .pricing-card, .why-visual').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Get full page height
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

  // Take a full-page screenshot as PDF
  // Using screenshot approach for pixel-perfect capture, then convert
  await page.pdf({
    path: '/sessions/focused-sharp-darwin/mnt/outputs/macromicro-ai.pdf',
    width: '1440px',
    height: `${bodyHeight}px`,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  console.log(`PDF created. Page height: ${bodyHeight}px`);

  await browser.close();
})();
