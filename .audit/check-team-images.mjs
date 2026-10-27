import fs from 'node:fs/promises';
const source=await fs.readFile('lib/images.ts','utf8');
const entries=[...source.matchAll(/(team\w+): \{\s*id: "[^"]+",\s*url: u\("([^"]+)"\)/g)];
await fs.mkdir('.audit/team-images',{recursive:true});
await Promise.all(entries.map(async([,id,photo])=>{const r=await fetch(`https://images.unsplash.com/${photo}?w=400&h=533&fit=crop&crop=faces&q=75`,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(`${id}: ${r.status}`);await fs.writeFile(`.audit/team-images/${id}.jpg`,Buffer.from(await r.arrayBuffer()));console.log(id,r.status,r.headers.get('content-type'));}));
