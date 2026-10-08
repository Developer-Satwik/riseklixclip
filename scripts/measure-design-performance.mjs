import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
const phase=process.argv[2]||'baseline';
if(!['baseline','after'].includes(phase))throw Error('Use baseline or after');
const origin='http://127.0.0.1:8770';
const routes=['/','/resources/','/compare/video-clipping-vs-video-editing-vs-ugc-india.html'];
const browser=await chromium.launch({headless:true,channel:'chrome'});
const samples=[];
for(const route of routes)for(let run=1;run<=3;run++){
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
 const external=[];page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url())});
 await page.addInitScript(()=>{
  window.__designPerf={lcp:0,cls:0,longTasks:[]};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__designPerf.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__designPerf.cls+=e.value}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__designPerf.longTasks.push(e.duration)}).observe({type:'longtask',buffered:true});
 });
 await page.goto(origin+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const data=await page.evaluate(()=>({metrics:window.__designPerf,resources:performance.getEntriesByType('resource').map(e=>({name:e.name.replace(location.origin,''),transferSize:e.transferSize,decodedBodySize:e.decodedBodySize})),load:performance.getEntriesByType('navigation')[0].loadEventEnd,idleAnimations:document.getAnimations().filter(a=>a.playState==='running').length}));
 let filterToPaint=null;
 if(route==='/resources/')filterToPaint=await page.evaluate(async()=>{
  const input=document.querySelector('#resource-search'),start=performance.now();input.value='permission';input.dispatchEvent(new Event('input',{bubbles:true}));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return performance.now()-start;
 });
 samples.push({route,run,...data,filterToPaint,externalRequests:external});await context.close();
 console.log(`${phase} ${route} run ${run}: LCP ${Math.round(data.metrics.lcp)}ms, CLS ${data.metrics.cls.toFixed(4)}`);
}
await browser.close();
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const report={checkedAt:new Date().toISOString(),phase,conditions:{viewport:[390,844],cpuSlowdown:4,downloadBitsPerSecond:1600000,latencyMs:150,coldCache:true,runsPerRoute:3},assets:['styles.css','script.js'].map(file=>{const b=fs.readFileSync('public/'+file);return {file,bytes:b.length,gzipBytes:gzipSync(b).length}}),samples,medians:routes.map(route=>{const rows=samples.filter(r=>r.route===route);return {route,lcpMs:median(rows.map(r=>r.metrics.lcp)),cls:median(rows.map(r=>r.metrics.cls)),loadMs:median(rows.map(r=>r.load)),filterToPaintMs:route==='/resources/'?median(rows.map(r=>r.filterToPaint)):null}}),limitations:'Controlled local Chrome lab samples, not field Core Web Vitals or real-user INP. Filter-to-paint is a synthetic two-frame observation. Three runs expose some variability; absolute results depend on this machine.'};
fs.writeFileSync(`docs/design-performance-${phase}.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({phase,assets:report.assets,medians:report.medians},null,2));
