// Builds prompts with the page's own code (CASE, P, codeCheck), so recorded runs use the exact instructions.
const fs=require('fs');const src=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const a=src.indexOf('const TODAY=');const b=src.indexOf('/* ---------- versions');
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const api=new Function('norm',src.slice(a,b)+';return {P,codeCheck,CASE};')(norm);
const [step,arg]=process.argv.slice(2);
const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sents=f=>J(f).sentences.map(s=>({...s,rests_on:s.rests_on||(s.source?[s.source]:[])}));
if(step==='checker'){fs.writeFileSync(arg.replace('.json','.checker-prompt.txt'),api.P.checker(sents(arg)));console.log('ok');}
if(step==='code'){console.log(JSON.stringify(api.codeCheck(sents(arg))));}
if(step==='reviser'){const [d,c]=arg.split(',');const s=sents(d);const flags=[...J(c).checks.filter(x=>x.verdict==='unsupported').map(x=>({n:x.n,reason:x.reason})),...api.codeCheck(s).map(f=>({n:f.n,reason:'Number not found in the case: '+f.token}))];fs.writeFileSync('a3-reviser-prompt.txt',api.P.reviser(s,flags));console.log(JSON.stringify(flags));}
if(step==='checker2'){fs.writeFileSync('a3-checker2-prompt.txt',api.P.checker(J(arg).sentences.filter(s=>String(s.text).trim())));console.log('ok');}
if(step==='translator'){fs.writeFileSync('a3-translator-prompt.txt',api.P.translator(J(arg).sentences.filter(s=>String(s.text).trim())));console.log('ok');}
