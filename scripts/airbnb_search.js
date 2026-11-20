const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch();
 const out=[];
 for(const url of process.argv.slice(2)){
  const p=await b.newPage({locale:'en-US',viewport:{width:1400,height:1000}});
  try{
  await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(7000);
  const head=await p.evaluate(()=>{const h=document.querySelector('h1');return h?h.innerText:''});
  const cards=await p.evaluate(()=>[...document.querySelectorAll('[itemprop="itemListElement"], [data-testid="card-container"]')].map(c=>{const a=c.querySelector('a[href*="/rooms/"]');return {href:a?a.href.split('?')[0]:'',text:c.innerText.replace(/\n+/g,' | ')}}));
  console.log('### '+url+'\n'+head);
  const seen=new Set();for(const c of cards){if(seen.has(c.href))continue;seen.add(c.href);console.log(c.href+'  ::  '+c.text.slice(0,260))}
  }catch(e){console.log('ERR',url,e.message)}
  await p.close();
 }
 await b.close();
})();
