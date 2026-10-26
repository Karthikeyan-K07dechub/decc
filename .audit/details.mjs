import fs from 'node:fs';import {connect,sleep} from './cdp.mjs';
const c=await connect(true),out=[];
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
const content=fs.readFileSync('lib/content/index.ts','utf8');const slugs=[...content.matchAll(/slug: "([a-z][a-z-]+)"/g)].map(m=>m[1]).filter((s,i,a)=>a.indexOf(s)===i);
for(const locale of ['en','ar'])for(const [i,slug] of slugs.entries()){
 const path='/'+locale+'/'+(i<6?'services':'projects')+'/'+slug;
 await c.viewport(320,568,true);await c.send('Page.navigate',{url:'http://127.0.0.1:3000'+path});
 for(let j=0;j<100;j++){await sleep(200);if(await c.evaluate(`location.pathname===${JSON.stringify(path)}&&!!document.querySelector('h1')&&document.readyState!=='loading'`))break;}
 await c.evaluate('document.fonts.ready.then(()=>true)');await sleep(800);
 for(const [w,h] of [[320,568],[1024,768]]){await c.viewport(w,h,w<1024);await sleep(400);out.push({path,w,...await c.evaluate(`(()=>{const W=document.documentElement.clientWidth;return {width:W,docWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *,header .wrap,header>.wrap>*')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.left < -2||r.right>W+2)&&!e.closest('svg')}).slice(0,10).map(e=>({text:e.textContent.slice(0,100),tag:e.tagName,class:e.className,x:e.getBoundingClientRect().x,w:e.getBoundingClientRect().width}))}})()`)});}
 console.log(path);
}
fs.writeFileSync('.audit/details.json',JSON.stringify(out,null,2));c.close();
