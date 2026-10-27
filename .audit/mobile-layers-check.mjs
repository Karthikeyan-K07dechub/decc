import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';const c=await connect(true),results=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
const inspect=`(()=>{const e=document.querySelector('[data-exploded-stage]'),p=e.parentElement,r=e.getBoundingClientRect();return {pinned:p.classList.contains('pin-spacer'),top:r.top,height:r.height,width:r.width,documentTop:r.top+scrollY,distance:p.classList.contains('pin-spacer')?p.offsetHeight-e.offsetHeight:0,active:e.querySelector('.group[data-active=true]')?.textContent.trim(),labelOpacity:[...e.querySelectorAll('.group')].map(l=>Number(l.style.opacity)),viewport:document.documentElement.clientHeight}})()`;
for(const locale of ['en','ar']){
 await c.viewport(390,844,true);await c.navigate('/'+locale);await sleep(2500);
 for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390]]){
  await c.viewport(width,height,true);await c.evaluate('window.scrollTo(0,0)');await sleep(800);const initial=await c.evaluate(inspect);const target=Math.max(80,(height-initial.height)/2),start=initial.documentTop-target;
  const phases=[];
  for(const progress of [.36,.46,.57,.68,.79]){await c.evaluate(`window.scrollTo(0,${start+initial.distance*progress})`);await sleep(500);phases.push(await c.evaluate(inspect));}
  await c.evaluate(`window.scrollTo(0,${start+initial.distance})`);await sleep(500);const end=await c.evaluate(inspect);
  if(width===390)await c.screenshot('mobile-layers-complete-'+locale);
  await c.evaluate(`window.scrollTo(0,${start+initial.distance+200})`);await sleep(500);const after=await c.evaluate(inspect);
  const passed=initial.pinned&&Math.abs(initial.distance-height*2)<2&&phases.every((p,i)=>Math.abs(p.top-target)<2&&p.active?.startsWith('0'+(i+1)))&&end.labelOpacity.every(x=>x<.01)&&after.top<target-180&&initial.height<=height-144+1;
  results.push({locale,width,height,target,start,initial,phases,end,after,passed});console.log(locale,width,height,'layers',phases.map(p=>p.active),'passed',passed);
 }
}
await c.viewport(390,844,true);await c.evaluate('window.scrollTo(0,0)');await sleep(900);const base=await c.evaluate(inspect);const target=(844-base.height)/2;await c.evaluate(`window.scrollTo(0,${base.documentTop-target})`);await sleep(600);await c.send('Page.bringToFront');
const swipe=async()=>{await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:700}]});for(let i=1;i<=12;i++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:700-i*30}]});await sleep(55);}await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(500);};
await swipe();const touchMid=await c.evaluate(inspect);for(let i=0;i<6;i++)await swipe();const touchAfter=await c.evaluate(inspect);const touchPassed=Math.abs(touchMid.top-target)<2&&touchAfter.top<target-100;
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await sleep(700);const reduced=await c.evaluate(inspect);
fs.writeFileSync('.audit/mobile-layers-results.json',JSON.stringify({results,touchPassed,touchMid,touchAfter,reduced,errors:c.errors},null,2));console.log('Touch scroll:',touchPassed,'Reduced-motion pin:',reduced.pinned,'Browser errors:',c.errors.length);if(results.some(r=>!r.passed)||!touchPassed||reduced.pinned||c.errors.length)process.exitCode=1;c.close();
