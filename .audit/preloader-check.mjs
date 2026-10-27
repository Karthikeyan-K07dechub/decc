import { connect, sleep } from './cdp.mjs';
const b = await connect(true);
try {
  const init = await b.send('Page.addScriptToEvaluateOnNewDocument', {source: 'sessionStorage.removeItem("decc-preloaded");window.__revealed=0;window.addEventListener("decc:revealed",()=>window.__revealed++);'});
  for (const [width,height,locale] of [[375,667,'en'],[1366,768,'en'],[375,667,'ar'],[844,390,'en']]) {
    await b.viewport(width,height,width<1024);
    await b.send('Page.navigate',{url:`http://localhost:3000/${locale}/about`});
    let started=false;
    for(let i=0;i<300;i++) {
      await sleep(50);
      started=await b.evaluate('!!document.querySelector("[data-letter]")?.style.transform');
      if(started) break;
    }
    if(!started) throw Error('Intro did not start');
    await sleep(1000);
    const layout = await b.evaluate(`(() => {
      const word=document.querySelector('.preloader-word').getBoundingClientRect();
      const footer=document.querySelector('.preloader-footer').getBoundingClientRect();
      return {left:word.left,right:word.right,bottom:word.bottom,footer:footer.top,width:innerWidth,visible:getComputedStyle(document.querySelector('.preloader')).display};
    })()`);
    if(layout.left<0 || layout.right>width || layout.bottom>=layout.footer || layout.visible==='none') throw Error(JSON.stringify(layout));
    await b.screenshot(`premium-preloader-${locale}-${width}`);
    await sleep(2300);
    const finished=await b.evaluate('({overlay:!!document.querySelector(".preloader"),locked:document.documentElement.style.overflow,event:window.__revealed})');
    if(finished.overlay || finished.locked || finished.event!==1) throw Error(JSON.stringify(finished));
    console.log(locale,width,layout,finished);
  }
  await b.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier});
  await b.navigate('/en/about');
  if(await b.evaluate('!!document.querySelector(".preloader") || document.documentElement.classList.contains("preload")')) throw Error('Repeat visit not skipped');
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.send('Page.addScriptToEvaluateOnNewDocument',{source:'sessionStorage.removeItem("decc-preloaded")'});
  await b.navigate('/en/about');
  if(await b.evaluate('!!document.querySelector(".preloader") || document.documentElement.style.overflow === "hidden"')) throw Error('Reduced motion failed');
  console.log('Repeat visit and reduced motion passed. Browser errors:',b.errors.length);
} finally { b.close(); }
