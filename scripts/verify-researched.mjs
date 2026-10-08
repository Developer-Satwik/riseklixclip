import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import editorial from '../src/content.cjs';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='http://127.0.0.1:8770';
const batch=Number(process.argv[2]||1);assert([1,2,3].includes(batch));const cohort=editorial.articles.filter(a=>a.researchedArticle&&(a.researchBatch||1)===batch);assert.equal(cohort.length,batch===3?6:10);
const dir=path.join(root,'docs/screenshots',batch===3?'research-round-three':batch===2?'research-round-two':'researched-articles');fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1440,height:600},reducedMotion:'reduce'});
const checks=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
for(const a of cohort){
 const route=`/${a.section}/${a.slug}.html`;
 await page.setViewportSize({width:1440,height:600});await page.goto(origin+route);await page.selectOption('.theme-select','light');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>window.scrollTo(0,document.querySelector('.article-layout').getBoundingClientRect().top+scrollY));
 const toc=await page.locator('.toc').evaluate(el=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,viewport:innerHeight,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}));
 assert(toc.top>=0&&toc.bottom<=toc.viewport,'Contents fits short laptop viewport');
 await page.locator('.toc nav a').last().focus();const box=await page.locator('.toc nav a').last().boundingBox();assert(box.y>=0&&box.y+box.height<=600,'Last contents link can receive visible keyboard focus');
 await page.locator('.toc nav a[href="#section-1"]').click();assert.equal(await page.locator('#section-1 h2').innerText(),a.sections[0].heading);
 await page.screenshot({path:path.join(dir,a.slug+'-desktop.png')});
 for(const theme of ['light','dark']){
  await page.setViewportSize({width:320,height:800});await page.selectOption('.theme-select',theme);await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'No narrow-screen overflow');
  await page.screenshot({path:path.join(dir,a.slug+'-mobile-'+theme+'.png')});
  for(const table of await page.locator('.table-scroll').all()){
   assert.equal(await table.getAttribute('tabindex'),'0');assert(await table.getAttribute('aria-label'));
   const data=await table.evaluate(el=>{el.scrollLeft=el.scrollWidth;return {width:el.clientWidth,total:el.scrollWidth,left:el.scrollLeft}});
   if(data.total>data.width)assert(data.left>0,'Wide table is horizontally scrollable');await table.evaluate(el=>{el.scrollLeft=0});
  }
  const index=a.sections.findIndex(s=>s.table);await page.evaluate(id=>window.scrollTo(0,document.getElementById(id).getBoundingClientRect().top+scrollY-24),`section-${index+1}`);
  await page.screenshot({path:path.join(dir,a.slug+'-worksheet-'+theme+'.png')});
  await page.locator('#questions summary').first().click();assert.equal(await page.locator('#questions details').first().getAttribute('open'),'');
 }
 checks.push({slug:a.slug,sections:a.sections.length,faqs:a.faq.length,tables:a.sections.filter(s=>s.table).length,toc,desktopViewport:[1440,600],mobileViewport:[320,800],themes:['light','dark'],nativeFAQ:true,scrollableTables:true});
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}}),plain=await nojs.newPage();
for(const a of cohort){
 await plain.goto(origin+`/${a.section}/${a.slug}.html`);assert.equal(await plain.locator('[id^="section-"] h2').count(),a.sections.length);
 assert.equal(await plain.locator('#site-nav').isVisible(),true);await plain.locator('#questions summary').first().click();assert.equal(await plain.locator('#questions details').first().getAttribute('open'),'');
}
const report={checkedAt:new Date().toISOString(),researchBatch:batch,articles:checks.length,checks,pageErrors:errors,noJavaScript:`All ${cohort.length} bodies, navigation and native FAQs checked`,limitations:'Local browser layout and interactions; no field performance, live analytics or search/citation gains measured.'};
fs.writeFileSync(path.join(root,`docs/${batch===3?'research-round-three-verification':batch===2?'research-round-two-verification':'researched-article-verification'}.json`),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({articles:checks.length,pageErrors:errors,noJavaScript:report.noJavaScript,viewports:[[1440,600],[320,800]],themes:['light','dark']},null,2));assert.equal(errors.length,0);
