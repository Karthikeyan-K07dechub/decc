import {connect,sleep} from './cdp.mjs';
const b=await connect(true);
const url='http://localhost:3001';
async function waitFor(expression){
  for(let i=0;i<400;i++){if(await b.evaluate(expression))return;await sleep(50);}
  throw Error('Timed out: '+expression);
}
try{
  await b.send('Network.enable');
  const init=await b.send('Page.addScriptToEvaluateOnNewDocument',{source:'sessionStorage.removeItem("decc-preloaded");window.__introFinished=0;addEventListener("decc:revealed",()=>window.__introFinished++)'});
  for(const [width,height,locale] of [[375,667,'en'],[1366,768,'en'],[375,667,'ar']]){
    await b.viewport(width,height,width<1024);
    await b.send('Network.setBlockedURLs',{urls:['*/_next/static/*.js']});
    await b.send('Page.navigate',{url:`${url}/${locale}/about`});
    await waitFor('document.querySelectorAll("[data-stroke]").length===6');
    const initial=await b.evaluate('[...document.querySelectorAll("[data-stroke]")].map(el=>({length:el.getAttribute("pathLength"),dash:el.getAttribute("stroke-dasharray"),offset:el.getAttribute("stroke-dashoffset")}))');
    if(initial.some(p=>p.length!=='1'||p.dash!=='1'||p.offset!=='1'))throw Error('Initial drawing visible: '+JSON.stringify(initial));
    await b.send('Network.setBlockedURLs',{urls:[]});
    await b.send('Page.reload',{ignoreCache:true});
    await waitFor('Number.parseFloat(document.querySelector("[data-stroke]")?.style.strokeDashoffset)<1');
    await sleep(350);
    const during=await b.evaluate('({offset:Number.parseFloat(document.querySelector("[data-stroke]").style.strokeDashoffset),overflow:document.documentElement.scrollWidth>innerWidth})');
    if(during.offset<=0||during.offset>=1||during.overflow)throw Error(JSON.stringify(during));
    await b.screenshot(`original-intro-${locale}-${width}`);
    if(width===1366){
      await b.evaluate('setTimeout(()=>{const end=performance.now()+3000;while(performance.now()<end){}},0);true');
      await sleep(3150);
      if(!await b.evaluate('!!document.querySelector(".preloader")'))throw Error('Stall skipped intro');
    }
    await waitFor('!document.querySelector(".preloader")');
    if(!await b.evaluate('window.__introFinished===1 && document.documentElement.style.overflow!=="hidden"'))throw Error('Reveal did not complete');
    console.log(locale,width,'hidden server drawing, animated strokes, reveal passed');
  }
  await b.send('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier});
  await b.send('Page.navigate',{url:url+'/en/about'});
  await sleep(2500);
  if(await b.evaluate('!!document.querySelector(".preloader")'))throw Error('Repeat visit not skipped');
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.send('Page.addScriptToEvaluateOnNewDocument',{source:'sessionStorage.removeItem("decc-preloaded")'});
  await b.send('Page.reload',{ignoreCache:true});
  await sleep(2500);
  if(await b.evaluate('!!document.querySelector(".preloader")'))throw Error('Reduced motion not skipped');
  if(b.errors.length)throw Error(JSON.stringify(b.errors));
  console.log('Production checks, startup stall, repeat visit and reduced motion passed. Browser errors: 0');
}finally{b.close()}
