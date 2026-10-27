import {connect,sleep} from './cdp.mjs';
const c=await connect(true);
await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await c.viewport(1366,768);await c.navigate('/en/contact');
console.log('Contact page:',await c.evaluate('({title:document.title,heading:document.querySelector("h1")?.textContent,fields:document.querySelectorAll("form input").length})'));
await c.evaluate('document.querySelector("form button[type=submit]").click()');await sleep(1500);
const invalid=await c.evaluate('document.querySelectorAll("[aria-invalid=true]").length');
console.log('Validation errors after empty submission:',invalid,'Uncaught browser errors:',c.errors.length);
if(invalid<1||c.errors.length)process.exitCode=1;c.close();
