import {connect,sleep} from './cdp.mjs';
const c=await connect(true);
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
const large=process.argv.includes('--large');
for(const locale of large?['en']:['en','ar']){
 await c.viewport(locale==='en'?1280:390,locale==='en'?720:844,locale==='ar');await c.navigate('/'+locale+'/careers');
 await c.evaluate(`(()=>{const f=document.querySelector('form');f.elements.name.value='Application form test';f.elements.phone.value='+971500000000';f.elements.role.value='general';const d=new DataTransfer();d.items.add(new File(['%PDF-1.4\\nTest CV',new Uint8Array(${large?1200000:0})],'test-cv.pdf',{type:'application/pdf'}));f.elements.cv.files=d.files;f.elements.cv.dispatchEvent(new Event('change',{bubbles:true}));f.querySelector('button[type=submit]').click();})()`);
 for(let i=0;i<40;i++){await sleep(250);if(await c.evaluate('!!document.querySelector("[name=email][aria-invalid=true]")'))break;}
 const retained=await c.evaluate(`(()=>{const f=document.querySelector('form');return {name:f.elements.name.value,cv:f.elements.cv.files[0]?.name,invalid:[...f.querySelectorAll('[aria-invalid=true]')].map(e=>e.name)}})()`);
 if(retained.name!=='Application form test'||retained.cv!=='test-cv.pdf'||retained.invalid.join()!=='email')throw Error('Validation lost inputs: '+JSON.stringify(retained));
 await c.evaluate(`(()=>{const f=document.querySelector('form');f.elements.email.value='form-test@example.invalid';f.querySelector('button[type=submit]').click();})()`);
 for(let i=0;i<40;i++){await sleep(250);if(await c.evaluate('!!document.querySelector("main [role=status]")'))break;}
 await sleep(500);
 const success=await c.evaluate(`(()=>{const s=document.querySelector('main [role=status]');if(!s)return null;const r=s.getBoundingClientRect();return {text:s.textContent,focused:document.activeElement===s,visible:r.top>=64&&r.bottom<=innerHeight,formGone:!document.querySelector('main form')}})()`);
 console.log(locale,JSON.stringify({retained,success}));if(!success?.focused||!success.visible||!success.formGone)process.exitCode=1;
 await c.screenshot('application-success-'+locale);
}
if(c.errors.length){console.log(c.errors);process.exitCode=1;}c.close();
