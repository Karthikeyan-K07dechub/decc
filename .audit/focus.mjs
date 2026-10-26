import fs from 'node:fs';
import {connect,sleep} from './cdp.mjs';
const c=await connect(true);const out=[];
const rect=`e=>{if(!e)return null;const r=e.getBoundingClientRect();return {text:e.innerText?.slice(0,100),x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right}}`;
for(const locale of ['en','ar']){
 await c.viewport(390,844,true);await c.navigate('/'+locale);
 await sleep(3500);
 for(const [w,h,touch] of [[320,568,true],[375,667,true],[390,844,true],[844,390,true],[1024,600,false],[1280,720,false],[1920,1080,false]]){
  await c.viewport(w,h,touch);await c.evaluate('window.scrollTo(0,0)');await sleep(1500);
  const r=await c.evaluate(`(()=>{const rect=${rect};return {hero:[...document.querySelectorAll('[data-hero-copy]>*')].map(rect),header:rect(document.querySelector('header')),heroSection:rect(document.querySelector('[aria-labelledby="hero-title"]')),pins:document.querySelectorAll('.pin-spacer').length,featured:rect(document.querySelector('[aria-labelledby="featured-title"]')),exploded:rect(document.querySelector('[data-exploded-pin]'))}})()`);
  out.push({locale,w,h,touch,...r});await c.screenshot('normal-'+locale+'-'+w+'x'+h);
 }
 await c.viewport(390,844,true);await c.evaluate('window.scrollTo(0,0)');await sleep(1000);
 await c.evaluate('document.querySelector("button[aria-controls=mobile-menu]").click()');await sleep(800);
 out.push({locale,menu:await c.evaluate(`(()=>{const rect=${rect};const m=document.querySelector('#mobile-menu');return {rect:rect(m),scroll:scrollY,overflow:getComputedStyle(document.documentElement).overflow,last:rect(m.querySelector('a:last-child')),links:[...m.querySelectorAll('a')].map(a=>a.getAttribute('href'))}})()`)});
 await c.evaluate('window.scrollTo(0,300)');await sleep(500);out.push({locale,backgroundScrollWithMenu:await c.evaluate('scrollY')});
 await c.evaluate('document.querySelector("button[aria-controls=mobile-menu]").click()');
}
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await c.viewport(1280,720);await c.navigate('/en');
out.push({reducedDesktop:await c.evaluate(`(()=>{const e=document.querySelector('[aria-labelledby="exploded-title"]');return {text:e.innerText,listDisplay:getComputedStyle(e.querySelector('ol')).display}})()`)});
fs.writeFileSync('.audit/focused.json',JSON.stringify(out,null,2));fs.writeFileSync('.audit/focused-errors.json',JSON.stringify(c.errors,null,2));c.close();console.log('Focused checks complete');
