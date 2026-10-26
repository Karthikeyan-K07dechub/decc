import fs from 'node:fs';
import {connect,sleep} from './cdp.mjs';
const c=await connect(),results=[];
for(const reduced of [true,false]){
 await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
 for(const locale of ['en','ar']){
  await c.viewport(1440,900);await c.navigate('/'+locale);await sleep(2500);
  for(const [w,h] of [[320,568],[390,844],[1024,600],[1280,720],[1366,768],[1440,900],[1920,826]]){
   await c.viewport(w,h,w<1024);await c.evaluate('window.scrollTo(0,0)');await sleep(900);
   const result=await c.evaluate(`(()=>{const b=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}};const title=document.querySelector('#hero-title'),content=document.querySelector('.hero-content'),header=document.querySelector('header'),scene=document.querySelector('[data-hero-scene]'),hero=document.querySelector('.hero');return {font:getComputedStyle(title).fontSize,title:b(title),content:b(content),header:b(header),scene:b(scene),hero:b(hero),direction:document.dir,overflow:document.documentElement.scrollWidth>innerWidth,headerClear:content.getBoundingClientRect().top>=header.getBoundingClientRect().bottom,contentFits:content.getBoundingClientRect().bottom<=hero.getBoundingClientRect().bottom,columnsClear:innerWidth<1024||(document.dir==='rtl'?scene.getBoundingClientRect().right<=content.getBoundingClientRect().left:content.getBoundingClientRect().right<=scene.getBoundingClientRect().left)}})()`);
   results.push({locale,reduced,w,h,...result});console.log(JSON.stringify(results.at(-1)));
   if(!reduced&&(w===1366||w===1920||w===320))await c.screenshot('hero-fixed-'+locale+'-'+w+'x'+h);
  }
 }
}
fs.writeFileSync('.audit/hero-fix-results.json',JSON.stringify(results,null,2));c.close();
