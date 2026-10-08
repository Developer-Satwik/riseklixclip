import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../docs/screenshots/art-v2/',import.meta.url));fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const page=await browser.newPage();
const output=[];page.on('pageerror',e=>output.push({error:e.message}));
for(const [name,width,height,route] of [['home-desktop',1440,1000,'/'],['home-mobile',390,844,'/'],['home-small',320,800,'/'],['article-desktop',1440,1000,'/guides/creator-clipping-campaign-guide-india.html']]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:8770'+route);await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>{})))});await page.screenshot({path:dir+name+'.png'});
 output.push({name,width,route,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:Array.from(document.images).map(i=>({src:i.currentSrc.split('/').pop(),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})),og:document.querySelector('meta[property="og:image"]').content}))});
}
await page.goto('http://127.0.0.1:8770/');await page.selectOption('.theme-select','dark');await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:dir+'home-dark.png'});
fs.writeFileSync(dir+'verification.json',JSON.stringify(output,null,2));await browser.close();console.log(JSON.stringify(output,null,2));
