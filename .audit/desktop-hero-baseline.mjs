import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await c.viewport(1366,768);await c.navigate('/en');await sleep(3000);
const inspect=`(()=>{const e=document.querySelector('.hero'),p=e.parentElement;return {pinned:p.classList.contains('pin-spacer'),height:e.offsetHeight,distance:p.classList.contains('pin-spacer')?p.offsetHeight-e.offsetHeight:0,top:e.getBoundingClientRect().top,photo:Number(getComputedStyle(e.querySelector('[data-hero-photo]')).opacity),scene:Number(getComputedStyle(e.querySelector('[data-hero-scene]')).opacity)}})()`;
for(const [width,height] of [[1920,1080],[1366,768],[1280,600],[1264,550]]){
 await c.viewport(width,height);await c.evaluate('window.scrollTo(0,0)');await sleep(1200);const start=await c.evaluate(inspect);
 await c.evaluate(`window.scrollTo(0,${start.distance})`);await sleep(1200);const end=await c.evaluate(inspect);
 await c.evaluate(`window.scrollTo(0,${start.distance+240})`);await sleep(1200);const after=await c.evaluate(inspect);
 results.push({width,height,start,end,after});
}
const path=process.argv[2]||'.audit/desktop-before-mobile.json';fs.writeFileSync(path,JSON.stringify(results,null,2));console.log(JSON.stringify(results));c.close();
