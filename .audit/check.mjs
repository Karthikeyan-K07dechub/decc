import fs from 'node:fs';
import {connect,sleep} from './cdp.mjs';
const c=await connect();
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await c.viewport(390,844,true);
await c.navigate('/en');
console.log('Loaded',await c.evaluate('document.title'));
const routes=await c.evaluate('[...new Set([...document.querySelectorAll("a")].map(a=>new URL(a.href).pathname).filter(p=>p.startsWith("/en")))]');
fs.writeFileSync('.audit/routes.json',JSON.stringify(routes,null,2));
const results=[];
const inspect=`(()=>{const W=innerWidth;const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};const desc=e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'svg',text:e.textContent.trim().slice(0,100),rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}})()});return {title:document.title,width:W,docWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflow:[...document.querySelectorAll('main *,header *,footer *')].filter(e=>visible(e)&&!e.closest('svg')&&(e.getBoundingClientRect().right>W+2||e.getBoundingClientRect().left < -2)&&!e.closest('[data-track],[aria-labelledby="sectors-title"],.overflow-x-auto')).slice(0,22).map(desc),header:[...document.querySelector('header>.wrap').children].map(desc),shortControls:[...document.querySelectorAll('header button,header a,[role="dialog"] button')].filter(visible).map(desc),hero:document.querySelector('[data-hero-copy]')?desc(document.querySelector('[data-hero-copy]')):null,h1:desc(document.querySelector('h1')),exploded:document.querySelector('[aria-labelledby="exploded-title"]')?.innerText,table:document.querySelector('table')?{scroll:document.querySelector('table').parentElement.scrollWidth,client:document.querySelector('table').parentElement.clientWidth}:null};})()`;
const selected=process.argv.includes('--full')?routes:['/en','/en/about','/en/services','/en/projects','/en/careers','/en/contact',routes.find(r=>r.startsWith('/en/projects/')),routes.find(r=>r.startsWith('/en/services/'))].filter(Boolean);
for(const route of selected){
 for(const locale of ['en','ar']){
  const path=route.replace('/en','/'+locale);await c.navigate(path);
  for(const [w,h] of [[320,568],[390,844],[640,800],[768,1024],[1024,768],[1440,900]]){
   await c.viewport(w,h,w<1024);await sleep(200);const r=await c.evaluate(inspect);results.push({path,height:h,...r});
   if(r.overflow.length)console.log('OVERFLOW',path,w,JSON.stringify(r.overflow.map(o=>({text:o.text,x:o.rect.x,w:o.rect.w}))).slice(0,1200));
   if(w===320||w===1024)await c.screenshot(path.replaceAll('/','_')+'-'+w);
  }
 }
 fs.writeFileSync('.audit/results.json',JSON.stringify(results,null,2));console.log('Checked',route);
}
fs.writeFileSync('.audit/runtime-errors.json',JSON.stringify(c.errors,null,2));c.close();
