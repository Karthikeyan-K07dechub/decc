import { connect } from './cdp.mjs';
const browser = await connect(true);
try {
  for (const locale of ['en', 'ar']) {
    await browser.viewport(375, 667, true);
    await browser.navigate(`/${locale}/contact`);
    const result = await browser.evaluate(`(() => {
      const cards = [...document.querySelectorAll('main ul.wrap > li')];
      return {
        padding: cards.map(card => [getComputedStyle(card).paddingLeft, getComputedStyle(card).paddingRight]),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    })()`);
    console.log(locale, result);
    if (result.overflow || result.padding.length !== 4 || result.padding.some(p => p.some(v => v !== '24px'))) throw Error('Contact card spacing failed');
  }
  console.log('Browser errors:', browser.errors.length);
} finally { browser.close(); }
