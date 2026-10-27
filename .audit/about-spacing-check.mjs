import { connect } from './cdp.mjs';
const b = await connect(true);
try {
  for (const [width, height] of [[375, 667], [1366, 768]]) {
    await b.viewport(width, height, width < 1024);
    await b.navigate('/en/about');
    console.log(await b.evaluate(`(() => {
      const office = document.querySelector('[aria-labelledby="office-title"]');
      return {
        width: innerWidth,
        officeBottom: getComputedStyle(office.querySelector('.wrap')).paddingBottom,
        ctaTop: getComputedStyle(office.nextElementSibling).paddingTop
      };
    })()`));
  }
  console.log('Browser errors:', b.errors.length);
} finally { b.close(); }
