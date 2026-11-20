const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const l of process.argv.slice(2)){const q=await b.newPage();try{await q.goto(l,{waitUntil:'domcontentloaded',timeout:40000});await q.waitForTimeout(4000);
const t=await q.evaluate(()=>{const e=document.querySelector('#postingbody')||document.body;return e.innerText});console.log('\n=== '+l+'\n'+t.replace(/\s+/g,' ').slice(0,2500))}catch(e){console.log('ERR',l)}await q.close()}await b.close()})();
