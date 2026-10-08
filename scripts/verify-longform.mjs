import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import editorial from '../src/content.cjs';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='http://127.0.0.1:8770';
const dir=path.join(root,'docs/screenshots/expanded-articles');fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:600},reducedMotion:'reduce'});
const checks=[];
const samples=['creator-clipping-india-operating-manual-2026','riseklix-vs-clipping-net-india','hinglish-clipping-guide','how-to-track-clipping-roi','what-is-a-clipper','ai-tools-for-clipping-workflows'];
for(const slug of samples){
 const a=editorial.articles.find(a=>a.slug===slug),route=`/${a.section}/${slug}.html`;
 await page.setViewportSize({width:1440,height:600});await page.goto(origin+route);await page.selectOption('.theme-select','light');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>window.scrollTo(0,document.querySelector('.article-layout').getBoundingClientRect().top+scrollY));
 const toc=await page.locator('.toc').evaluate(x=>({top:x.getBoundingClientRect().top,bottom:x.getBoundingClientRect().bottom,height:x.clientHeight,scrollHeight:x.scrollHeight,viewport:innerHeight,overflow:getComputedStyle(x).overflowY}));
 assert(toc.bottom<=toc.viewport&&toc.top>=0,'Desktop contents fits a 600px viewport');
 await page.locator('.toc nav a').last().focus();const focused=await page.locator('.toc nav a').last().boundingBox();assert(focused.y>=0&&focused.y+focused.height<=600,'Final contents link is keyboard accessible');
 await page.locator('.toc nav a[href="#section-1"]').click();assert.equal(await page.locator('#section-1 h2').innerText(),a.sections[0].heading);
 await page.screenshot({path:path.join(dir,slug+'-desktop.png')});
 const firstAdded=a.sections.length-4,addedTable=a.sections.findIndex((s,i)=>i>=firstAdded&&s.table),depthSection=addedTable>=0?addedTable:firstAdded;
 assert.equal(await page.locator('[id^="section-"] h2').count(),a.sections.length);
 assert.equal(await page.locator('#questions summary').count(),a.faq.length);
 for(const mode of ['light','dark']){
  await page.setViewportSize({width:320,height:800});await page.selectOption('.theme-select',mode);await page.locator('#section-1').scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  for(const table of await page.locator('.table-scroll').all()){
   assert.equal(await table.getAttribute('tabindex'),'0');assert((await table.getAttribute('aria-label')).length>0);
   const dimensions=await table.evaluate(x=>{x.scrollLeft=x.scrollWidth;return {scrollLeft:x.scrollLeft,scrollWidth:x.scrollWidth,clientWidth:x.clientWidth,overflow:getComputedStyle(x).overflowX}});
   if(dimensions.scrollWidth>dimensions.clientWidth)assert(dimensions.scrollLeft>0,'Wide table remains scrollable on a phone');
   await table.evaluate(x=>{x.scrollLeft=0});
  }
  await page.screenshot({path:path.join(dir,slug+'-mobile-'+mode+'.png')});
  await page.evaluate(id=>window.scrollTo(0,document.getElementById(id).getBoundingClientRect().top+scrollY-24),`section-${depthSection+1}`);
  await page.screenshot({path:path.join(dir,slug+'-depth-mobile-'+mode+'.png')});
 }
 await page.locator('#questions').scrollIntoViewIfNeeded();await page.locator('#questions summary').first().click();assert.equal(await page.locator('#questions details').first().getAttribute('open'),'');
 checks.push({slug,desktopViewport:[1440,600],toc,mobileViewport:[320,800],themes:['light','dark'],tableNavigation:'Focusable, named, and scrollable where needed',faq:'Native disclosure opens'});
}
// Keep the earlier two-destination CTA behaviour intact after rebuilding all pages.
await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');
const invite='https://discord.gg/skQk3xZcRa';await page.context().route('https://discord.gg/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<p>Intercepted test destination. No Discord account action.</p>'}));
const popupPromise=page.waitForEvent('popup');await page.locator('[data-discord-invite]').click();const popup=await popupPromise;await popup.waitForLoadState();await page.waitForURL(origin+'/guides/how-to-become-a-clipper-india.html');assert.equal(popup.url(),invite);await popup.close();
const report={checkedAt:new Date().toISOString(),samples:checks,clipperAction:{guide:page.url(),discord:invite,externalRequestIntercepted:true},limitations:'Representative long-form layout and interaction checks. Full route and metadata checks are in verification.json.'};
fs.writeFileSync(path.join(root,'docs/longform-verification.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));
