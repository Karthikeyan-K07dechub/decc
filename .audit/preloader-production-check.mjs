import {connect,sleep} from './cdp.mjs';
const base=process.env.AUDIT_ORIGIN || 'http://localhost:3001';
const b=await connect(true);
async function waitFor(expression){
  for(let i=0;i<400;i++) {if(await b.evaluate(expression))return;await sleep(50);}
  throw Error(`Timed out: ${expression}`);
}
try {
  await b.send('Network.enable');
  await b.send('Page.addScriptToEvaluateOnNewDocument',{source:'sessionStorage.removeItem("decc-preloaded");window.__introFrames=[];const watch=()=>{const letters=[...document.querySelectorAll("[data-letter]")];if(letters.length)window.__introFrames.push({time:performance.now(),letters:letters.map(el=>({opacity:getComputedStyle(el).opacity,visibility:getComputedStyle(el).visibility,transform:el.style.transform}))});if(window.__introFrames.length<400)requestAnimationFrame(watch)};requestAnimationFrame(watch);'});
  for(const [width,height,locale] of [[375,667,'en'],[1366,768,'en'],[375,667,'ar']]) {
    await b.viewport(width,height,width<1024);
    // Block the client bundles to inspect the actual server HTML before hydration.
    await b.send('Network.setBlockedURLs',{urls:['*/_next/static/*.js']});
    await b.send('Page.navigate',{url:`${base}/${locale}/about`});
    await waitFor('document.querySelectorAll("[data-letter]").length===4');
    await sleep(300);
    const initial=await b.evaluate('[...document.querySelectorAll("[data-letter]")].map(el=>({visibility:getComputedStyle(el).visibility,opacity:getComputedStyle(el).opacity,inline:el.getAttribute("style")}))');
    if(initial.some(el=>el.visibility!=='hidden'||el.opacity!=='0'||!el.inline.includes('visibility:hidden')))throw Error(JSON.stringify(initial));
    console.log(locale,width,'Server HTML: all four letters hidden before hydration');
    await b.send('Network.setBlockedURLs',{urls:[]});
    await b.send('Page.reload',{ignoreCache:true});
    await waitFor('document.querySelector("[data-letter]")?.style.visibility==="inherit" || Number(document.querySelector("[data-letter]")?.style.opacity)>0');
    await sleep(350);
    const during=await b.evaluate('[...document.querySelectorAll("[data-letter]")].map(el=>({opacity:Number(getComputedStyle(el).opacity),transform:el.style.transform}))');
    if(!during.some(el=>el.opacity>0&&el.opacity<1))throw Error('No entrance animation observed: '+JSON.stringify(during));
    await waitFor('!document.querySelector(".preloader")');
    const frames=await b.evaluate('window.__introFrames');
    if(frames[0].letters.some(el=>el.visibility!=='hidden'||el.opacity!=='0'))throw Error('Visible first frame: '+JSON.stringify(frames[0]));
    const final=await b.evaluate('({overflow:document.documentElement.style.overflow,preload:document.documentElement.classList.contains("preload")})');
    if(final.overflow||final.preload)throw Error(JSON.stringify(final));
    console.log(locale,width,'First painted frame hidden; staggered entrance and reveal passed');
  }
  if(b.errors.length)throw Error(JSON.stringify(b.errors));
  console.log('Production checks passed. Browser errors: 0');
}finally{b.close()}
