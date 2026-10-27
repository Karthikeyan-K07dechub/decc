import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
const inspect=`(()=>{const e=document.querySelector('.hero'),p=e.parentElement,copy=e.querySelector('[data-hero-copy]');return {scroll:scrollY,top:e.getBoundingClientRect().top,height:e.offsetHeight,copyHeight:copy.offsetHeight,pinned:p.classList.contains('pin-spacer'),spacerHeight:p.classList.contains('pin-spacer')?p.offsetHeight:0,photo:Number(getComputedStyle(e.querySelector('[data-hero-photo]')).opacity),scene:Number(getComputedStyle(e.querySelector('[data-hero-scene]')).opacity),nextTop:document.querySelector('main>section[aria-label]')?.getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth}})()`;
for(const locale of ['en','ar']){
 await c.viewport(1366,768);await c.navigate('/'+locale);await sleep(3000);
 for(const [width,height] of [[1366,768],[1280,600],[1264,550],[1024,600],[1920,1080],[1920,420],[390,844]]){
  await c.viewport(width,height,width<1024);await c.evaluate('window.scrollTo(0,0)');await sleep(1300);const start=await c.evaluate(inspect);
  const distance=start.pinned?start.spacerHeight-start.height:height;
  await c.evaluate(`window.scrollTo(0,${distance*.5})`);await sleep(1200);const middle=await c.evaluate(inspect);
  await c.evaluate(`window.scrollTo(0,${distance})`);await sleep(1200);const end=await c.evaluate(inspect);
  await c.evaluate(`window.scrollTo(0,${distance+240})`);await sleep(1200);const after=await c.evaluate(inspect);
  const fits=start.copyHeight<=height+1;
  const passed=!start.overflow&&start.pinned===(width>=1024&&fits)&&(!start.pinned||(Math.abs(middle.top)<2&&end.photo>=.59&&end.scene<=.13&&after.top < -200));
  const r={locale,width,height,distance,passed,start,middle,end,after};results.push(r);console.log(locale,width,height,'pinned',start.pinned,'range',distance,'passed',passed);
  if(width===1280){await c.evaluate(`window.scrollTo(0,${distance*.5})`);await sleep(1200);await c.screenshot('hero-scroll-'+locale+'-laptop-mid');}
 }
}
await c.viewport(1280,600);await c.evaluate('window.scrollTo(0,0)');await sleep(1300);
for(let i=0;i<4;i++){await c.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:1050,y:300,deltaX:0,deltaY:300});await sleep(1000);}
const wheel=await c.evaluate(inspect);console.log('Wheel scroll released hero:',wheel.top < -200);if(wheel.top>=-200)process.exitCode=1;
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await c.viewport(1280,600);await c.evaluate('window.scrollTo(0,0)');await sleep(1000);const reduced=await c.evaluate(inspect);console.log('Reduced motion pin:',reduced.pinned);if(reduced.pinned)process.exitCode=1;
fs.writeFileSync('.audit/hero-scroll-results.json',JSON.stringify({results,wheel,reduced,errors:c.errors},null,2));if(results.some(r=>!r.passed)||c.errors.length)process.exitCode=1;c.close();
