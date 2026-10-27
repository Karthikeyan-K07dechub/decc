import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const locale of ['en','ar']){
 await c.viewport(1366,900);await c.navigate('/'+locale+'/contact');
 for(const width of [1366,390,320]){
  await c.viewport(width,900,width<1024);await c.evaluate('document.querySelector("iframe").scrollIntoView({block:"center"})');await sleep(2500);
  const result=await c.evaluate(`(()=>{const f=document.querySelector('iframe'),a=f.nextElementSibling,r=f.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;return {src:f.src,href:a.href,target:a.target,label:a.getAttribute('aria-label'),mapWidth:r.width,height:r.height,docWidth:document.documentElement.scrollWidth,right:r.right,clickable:document.elementFromPoint(x,y)?.closest('a')===a}})()`);results.push({locale,width,...result});
  if(width===1366||width===390)await c.screenshot('real-map-'+locale+'-'+width);
 }
}
console.log(JSON.stringify(results));fs.writeFileSync('.audit/map-results.json',JSON.stringify(results,null,2));c.close();
