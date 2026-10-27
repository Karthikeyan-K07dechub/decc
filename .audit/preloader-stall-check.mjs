import {connect,sleep} from './cdp.mjs';
const b=await connect(true);
try {
  await b.viewport(1366,768);
  await b.send('Page.addScriptToEvaluateOnNewDocument',{source:'sessionStorage.removeItem("decc-preloaded")'});
  await b.send('Page.navigate',{url:'http://localhost:3000/en/about'});
  for(let i=0;i<300;i++) {
    await sleep(30);
    if(await b.evaluate('!!document.querySelector("[data-letter]")?.style.transform'))break;
  }
  await b.evaluate('setTimeout(()=>{const end=performance.now()+3000;while(performance.now()<end){}},150);true');
  await sleep(3400);
  console.log('Immediately after a 3-second startup stall:',await b.evaluate('({visible:!!document.querySelector(".preloader"),count:document.querySelector("[data-pct]")?.textContent})'));
  await sleep(3500);
  console.log('After playback:',await b.evaluate('({visible:!!document.querySelector(".preloader"),overflow:document.documentElement.style.overflow})'));
  console.log('Browser errors:',JSON.stringify(b.errors));
}finally{b.close()}
