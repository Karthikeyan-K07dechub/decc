import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const locale of ['en','ar']){
 await c.viewport(1440,900);await c.navigate('/'+locale+'/about');
 for(const [width,height] of [[1440,900],[768,1024],[390,844],[320,568]]){
  await c.viewport(width,height,width<1024);await c.evaluate('document.querySelector("[aria-labelledby=team-title]").scrollIntoView({block:"start"})');await sleep(1200);
  await c.evaluate('Promise.all([...document.querySelectorAll("[aria-labelledby=team-title] img")].map(i=>i.decode().catch(()=>null)))');
  const r=await c.evaluate(`(()=>{const s=document.querySelector('[aria-labelledby=team-title]');return {width:innerWidth,docWidth:document.documentElement.scrollWidth,names:[...s.querySelectorAll('li p.font-medium')].map(e=>e.textContent),images:[...s.querySelectorAll('img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,alt:i.alt})),overflow:[...s.querySelectorAll('li')].some(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth})}})()`);results.push({locale,width,height,...r});
  if(width===1440||width===390)await c.screenshot('team-'+locale+'-'+width);
 }
}
fs.writeFileSync('.audit/team-layout-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));c.close();
