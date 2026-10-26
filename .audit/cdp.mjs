import fs from 'node:fs';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function connect(create=false) {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const target=create?await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json():tabs.find(t=>t.type==='page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  let id=0; const pending=new Map(); const errors=[];
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,{resolve,reject});ws.send(JSON.stringify({id:i,method,params}));});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:'try{sessionStorage.setItem("decc-preloaded","1")}catch{}'});
  return {send,evaluate,errors,close:()=>ws.close(),
    viewport:async(width,height,mobile=false)=>{await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});await send('Emulation.setTouchEmulationEnabled',{enabled:mobile});},
    navigate:async path=>{await send('Page.navigate',{url:'http://127.0.0.1:3000'+path});for(let i=0;i<180;i++){await sleep(500);if(await evaluate('document.readyState === "complete" && !!document.querySelector("main h1")'))break;}await evaluate('document.fonts.ready.then(()=>true)');await sleep(1000);},
    screenshot:async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync('.audit/'+name+'.png',Buffer.from(r.data,'base64'));}
  };
}
