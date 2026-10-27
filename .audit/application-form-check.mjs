import {connect,sleep} from './cdp.mjs';
const c=await connect(true);
await c.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__formErrors=[];const original=console.error;console.error=(...a)=>{window.__formErrors.push(a.map(String).join(' '));original.apply(console,a);};`});
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const locale of ['en','ar']){
 await c.viewport(1280,720);await c.navigate('/'+locale+'/careers');
 const before=await c.evaluate(`(()=>{const f=document.querySelector('form');return {method:f.method,encoding:f.enctype,consoleErrors:window.__formErrors}})()`);
 await c.evaluate(`(()=>{const i=document.querySelector('input[type=file]'),d=new DataTransfer();d.items.add(new File(['%PDF-1.4\\nTest CV'], 'test-cv.pdf',{type:'application/pdf'}));i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('form button[type=submit]').click();})()`);
 for(let i=0;i<30;i++){await sleep(300);if(await c.evaluate('document.querySelectorAll("[aria-invalid=true]").length>0'))break;}
 const after=await c.evaluate(`({invalidFields:[...document.querySelectorAll('[aria-invalid=true]')].map(e=>e.name),uploadAccepted:document.querySelector('input[type=file]').getAttribute('aria-invalid')!=='true',errors:window.__formErrors})`);
 console.log(locale,JSON.stringify({before,after}));
 if(before.method!=='post'||before.encoding!=='multipart/form-data'||after.invalidFields.length!==4||!after.uploadAccepted||after.errors.length)process.exitCode=1;
}
if(c.errors.length){console.log(c.errors);process.exitCode=1;}c.close();
