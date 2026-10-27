import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const path of ['/en/services/architectural-design','/ar/services/architectural-design','/en/about','/en/contact','/en']){
 await c.viewport(1366,768);await c.navigate(path);
 for(const [width,height] of [[1024,600],[1366,768],[1536,864],[1920,826],[1920,1080],[390,844]]){
  await c.viewport(width,height,width<1024);await sleep(250);
  const sample=await c.evaluate(`(()=>{const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}};return {docWidth:document.documentElement.scrollWidth,viewport:innerWidth,h2:[...document.querySelectorAll('main h2')].map(e=>({text:e.textContent.trim(),font:parseFloat(getComputedStyle(e).fontSize),...box(e),parent:box(e.parentElement),scrollWidth:e.scrollWidth})),h1:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),accordion:[...document.querySelectorAll('.accordion-title')].map(e=>parseFloat(getComputedStyle(e).fontSize))}})()`);
  results.push({path,width,height,...sample});
  if(path==='/en/services/architectural-design'&&width===1366){await c.evaluate('document.querySelector("[aria-labelledby=faq-title]").scrollIntoView({block:"center"})');await sleep(500);await c.screenshot('laptop-questions-1366');}
 }
 console.log('Checked headings:',path);
}
fs.writeFileSync('.audit/laptop-title-results.json',JSON.stringify(results,null,2));
const failures=results.filter(r=>r.docWidth>r.width||r.h2.some(t=>t.scrollWidth>t.width+2));
console.log('Cases:',results.length,'Overflow cases:',JSON.stringify(failures),'Browser errors:',c.errors.length);
if(failures.length||c.errors.length)process.exitCode=1;c.close();
