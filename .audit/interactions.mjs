import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),out=[];
const box=`e=>{const r=e.getBoundingClientRect();return {text:e.innerText?.slice(0,90),x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}}`;
for(const reduced of [true,false]){
 await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
 for(const locale of ['en','ar']){
  await c.viewport(1024,600,false);await c.navigate('/'+locale);await sleep(2000);
  for(const name of ['featured-title','exploded-title']){
   await c.evaluate(`window.scrollTo(0,document.querySelector('[aria-labelledby="${name}"]').getBoundingClientRect().top+scrollY)`);await sleep(1600);
   out.push({reduced,locale,section:name,...await c.evaluate(`(()=>{const b=${box};const s=document.querySelector('[aria-labelledby="${name}"]');return {scrollY,section:b(s),scrollWidth:s.scrollWidth,clientWidth:s.clientWidth,overflow:getComputedStyle(s).overflow,panels:[...s.querySelectorAll('[data-panel]')].map(b),stage:s.querySelector('[data-exploded-pin]')?b(s.querySelector('[data-exploded-pin]')):null}})()`)});
   await c.screenshot((reduced?'reduced':'motion')+'-'+locale+'-'+name+'-1024x600');
  }
 }
}
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await c.viewport(390,844,true);await c.navigate('/en/projects');
await c.evaluate('document.querySelectorAll("button[aria-pressed]")[1].click()');await sleep(500);
out.push({filter:await c.evaluate('[...document.querySelectorAll("[data-tile]")].filter(e=>getComputedStyle(e).display!=="none").length')});
await c.navigate('/en/services/architectural-design');
await c.evaluate('document.querySelector("main button[aria-controls]").click()');await sleep(300);
out.push({faq:await c.evaluate(`(()=>{const b=document.querySelector('main button[aria-controls]');const p=document.getElementById(b.getAttribute('aria-controls'));return {expanded:b.getAttribute('aria-expanded'),height:p.clientHeight,scrollHeight:p.scrollHeight}})()`)});
await c.navigate('/en/projects/villa-al-dhait');
await c.evaluate('document.querySelector("main ul button").click()');await sleep(300);
out.push({gallery:await c.evaluate(`(()=>{const d=document.querySelector('[role="dialog"]');const b=${box};return {dialog:b(d),buttons:[...d.querySelectorAll('button')].map(b),bodyLocked:document.documentElement.style.overflow}})()`)});await c.screenshot('gallery-mobile');
await c.evaluate('document.querySelector("[data-close]").click()');
await c.navigate('/en/contact');
await c.evaluate('document.querySelector("form button[type=submit]").click()');await sleep(1500);
out.push({emptyForm:await c.evaluate(`({invalid:document.querySelectorAll('[aria-invalid="true"]').length,errors:[...document.querySelectorAll('.field-error')].map(e=>e.textContent),width:document.documentElement.scrollWidth})`)});
fs.writeFileSync('.audit/interactions.json',JSON.stringify(out,null,2));c.close();console.log('Interaction checks complete');
