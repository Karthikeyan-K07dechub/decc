import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
const inspect=`(()=>{const h=document.querySelector('.hero'),p=h.parentElement,copy=h.querySelector('[data-hero-copy]');return {scroll:scrollY,top:h.getBoundingClientRect().top,height:h.offsetHeight,copyHeight:copy.offsetHeight,pinned:p.classList.contains('pin-spacer'),distance:p.classList.contains('pin-spacer')?p.offsetHeight-h.offsetHeight:0,photo:Number(getComputedStyle(h.querySelector('[data-hero-photo]')).opacity),scene:Number(getComputedStyle(h.querySelector('[data-hero-scene]')).opacity),next:p.nextElementSibling?.getBoundingClientRect().top,viewport:innerHeight}})()`;
for(const locale of ['en','ar']){
 await c.viewport(390,844,true);await c.navigate('/'+locale);await sleep(3000);
 for(const [width,height] of [[320,568],[360,640],[375,667],[390,844],[430,932],[844,390]]){
  await c.viewport(width,height,true);await c.evaluate('window.scrollTo(0,0)');await sleep(650);const initial=await c.evaluate(inspect);
  const start=Math.max(0,initial.copyHeight-height);
  await c.evaluate(`window.scrollTo(0,${start+initial.distance*.5})`);await sleep(450);const middle=await c.evaluate(inspect);
  await c.evaluate(`window.scrollTo(0,${start+initial.distance})`);await sleep(450);const end=await c.evaluate(inspect);
  await c.evaluate(`window.scrollTo(0,${start+initial.distance+200})`);await sleep(450);const after=await c.evaluate(inspect);
  const passed=initial.pinned&&Math.abs(initial.distance-height)<2&&Math.abs(middle.top+start)<2&&middle.next>=height-2&&end.photo>=.59&&end.scene<=.13&&after.top<-(start+180)&&after.next<height;
  results.push({locale,width,height,start,initial,middle,end,after,passed});console.log(locale,width,height,'passed',passed);
  if(width===390){await c.evaluate(`window.scrollTo(0,${start+initial.distance*.5})`);await sleep(400);await c.screenshot('mobile-hero-held-'+locale);}
 }
}
await c.viewport(390,844,true);await c.evaluate('window.scrollTo(0,0)');await sleep(700);await c.send('Page.bringToFront');
const swipe=async()=>{await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:700}]});for(let i=1;i<=12;i++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:700-i*30}]});await sleep(60);}await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(600);};
await swipe();const touchMiddle=await c.evaluate(inspect);await swipe();await swipe();const touchAfter=await c.evaluate(inspect);console.log('Touch swipe',JSON.stringify({touchMiddle,touchAfter}));
const touchPassed=touchMiddle.scroll>100&&touchMiddle.scroll<844&&Math.abs(touchMiddle.top)<2&&touchAfter.top<-100&&touchAfter.photo>=.59;
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await c.evaluate('window.scrollTo(0,0)');await sleep(700);const reduced=await c.evaluate(inspect);
fs.writeFileSync('.audit/mobile-hero-results.json',JSON.stringify({results,touchPassed,touchMiddle,touchAfter,reduced,errors:c.errors},null,2));
if(results.some(r=>!r.passed)||!touchPassed||reduced.pinned||c.errors.length)process.exitCode=1;c.close();
