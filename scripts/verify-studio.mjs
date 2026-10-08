import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {gzipSync} from 'node:zlib';
const origin='http://127.0.0.1:8770',screens='docs/screenshots/studio-revision';fs.mkdirSync(screens,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[],external=[],observations=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{requests.push(r.url());if(!r.url().startsWith(origin))external.push(r.url())});
 await page.goto(origin+'/');await page.evaluate(()=>document.fonts.ready);
 assert(!requests.some(url=>/quick-search\.js|search-index\.json|studio-frame\.js/.test(url)),'Feature code and index are not requested on initial home load');
 for(const width of [1440,820,390,320])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1000});await page.selectOption('.theme-select',theme);await page.locator('#framing-studio').scrollIntoViewIfNeeded();
  await page.locator('.frame-controls').waitFor({state:'visible'});
  const height=await page.locator('.frame-stage').evaluate(el=>el.offsetHeight);
  for(const format of ['portrait','square','landscape']){
   const button=page.locator(`[data-frame-format=${format}]`);await button.focus();await page.keyboard.press('Enter');
   assert.equal(await button.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.frame-formats [aria-pressed=true]').count(),1);assert.equal(await page.locator('.frame-stage').getAttribute('data-frame'),format);
   assert.equal(await page.locator('.frame-stage').evaluate(el=>el.offsetHeight),height,'Frame changes do not shift the page');
   const dimensions=await page.locator('.art-frame').evaluate(el=>({w:el.offsetWidth,h:el.offsetHeight})),ratio={portrait:9/16,square:1,landscape:16/9}[format];assert(Math.abs(dimensions.w/dimensions.h-ratio)<.02);
  }
  await page.locator('#frame-focal').focus();await page.keyboard.press('Home');assert.equal(await page.locator('.frame-stage').evaluate(el=>el.style.getPropertyValue('--focal-point')),'0%');await page.keyboard.press('End');assert.equal(await page.locator('.frame-stage').evaluate(el=>el.style.getPropertyValue('--focal-point')),'100%');
  await page.locator('#frame-guide-toggle').click();assert.equal(await page.locator('.frame-guides').isVisible(),false);await page.locator('#frame-reset').click();assert.equal(await page.locator('#frame-focal').inputValue(),'72');assert.equal(await page.locator('.frame-guides').isVisible(),true);assert.equal(await page.locator('.frame-stage').getAttribute('data-frame'),'landscape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);observations.push({width,theme,formats:3,keyboardFocalPoint:true,guideAndReset:true,stageHeightStable:true,noOverflow:true});
  if(width===1440&&theme==='light')await page.locator('#framing-studio').screenshot({path:screens+'/framing-desktop.png'});
  if(width===390&&theme==='dark'){await page.locator('[data-frame-format=portrait]').click();await page.locator('#framing-studio').screenshot({path:screens+'/framing-mobile-dark.png'});}
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/compare/video-clipping-vs-video-editing-vs-ugc-india.html');await page.selectOption('.theme-select','light');
 const trigger=page.locator('[data-open-search]');await trigger.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#quick-search').dataset.indexLoaded==='true');
 assert.equal(await page.locator('#quick-search-input').evaluate(el=>el===document.activeElement),true);assert.equal(await page.locator('#quick-search-results>a').count(),8);
 await page.locator('#quick-search-input').fill('permissions');assert.match(await page.locator('#quick-search-status').innerText(),/matching resources/);assert(await page.locator('#quick-search-results>a').count()>0);
 await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#quick-search-results>a').first().evaluate(el=>el===document.activeElement),true);await page.keyboard.press('ArrowUp');assert.equal(await page.locator('#quick-search-input').evaluate(el=>el===document.activeElement),true);
 await page.locator('#quick-search-category').selectOption('platforms');assert((await page.locator('#quick-search-results>a').evaluateAll(links=>links.map(a=>a.getAttribute('href')))).every(href=>href.startsWith('/platforms/')));
 const full=await page.locator('#quick-search-all').getAttribute('href');assert(full.includes('q=permissions')&&full.includes('category=platforms'));
 await page.screenshot({path:screens+'/search-desktop.png'});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#quick-search').open);assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Control+k');assert.equal(await page.locator('#quick-search').evaluate(el=>el.open),true);await page.locator('.search-close').click();
 await page.goto(origin+full);assert.equal(await page.locator('#resource-search').inputValue(),'permissions');assert.equal(await page.locator('#resource-category').inputValue(),'platforms');assert((await page.locator('#resource-grid .resource-card:visible').count())>0);
 for(const width of [390,320]){
  await page.setViewportSize({width,height:600});await page.selectOption('.theme-select','dark');await page.locator('[data-open-search]').click();await page.waitForFunction(()=>document.querySelector('#quick-search').dataset.indexLoaded==='true');
  await page.locator('#quick-search-input').fill('no-matching-phrase-for-the-library');assert.equal(await page.locator('#quick-search-results>a').count(),0);assert.match(await page.locator('#quick-search-status').innerText(),/No articles found/);
  await page.locator('#quick-search-input').fill('clipping');await page.locator('#quick-search-category').selectOption('all');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert(await page.locator('#quick-search').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.left>=0&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1}));
  await page.locator('#quick-search-all').focus();await page.keyboard.press('Tab');assert(await page.locator('#quick-search').evaluate(el=>el.contains(document.activeElement)),'Native modal traps keyboard focus');
  if(width===390)await page.screenshot({path:screens+'/search-mobile-dark.png'});await page.keyboard.press('Escape');
 }
 const indexRequests=requests.filter(url=>url.includes('search-index.json'));assert.equal(indexRequests.length,2,'One index load per visited document despite repeated opening');
 const failedContext=await browser.newContext({viewport:{width:390,height:844}}),fp=await failedContext.newPage();let fails=1;
 await fp.route('**/search-index.json*',route=>fails-- >0?route.fulfill({status:503,body:'Unavailable in verification'}):route.continue());await fp.goto(origin+'/');await fp.locator('[data-open-search]').click();await fp.locator('.search-retry').waitFor({state:'visible'});assert.match(await fp.locator('#quick-search-status').innerText(),/could not load/);await fp.locator('.search-retry').click();await fp.waitForFunction(()=>document.querySelector('#quick-search').dataset.indexLoaded==='true');assert.equal(await fp.locator('#quick-search-results>a').count(),8);await failedContext.close();
 const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:844}}),np=await plain.newPage();await np.goto(origin+'/');await np.locator('#framing-studio').scrollIntoViewIfNeeded();assert.equal(await np.locator('.frame-controls').isVisible(),false);assert.equal(await np.locator('.art-frame').isVisible(),true);assert.equal(await np.locator('[data-open-search]').isVisible(),false);assert.equal(await np.locator('#quick-search').isVisible(),false);assert.equal(await np.locator('#framing-studio a').count(),1);await plain.close();
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/');await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:screens+'/home-desktop.png'});await page.goto(origin+'/compare/video-clipping-vs-video-editing-vs-ugc-india.html');await page.selectOption('.theme-select','light');await page.screenshot({path:screens+'/article-desktop.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const assets=['styles.css','script.js','studio-frame.js','quick-search.js','search-index.json'].map(file=>{const data=fs.readFileSync('public/'+file);return{file,bytes:data.length,gzipEstimateBytes:gzipSync(data).length}});
 assert(assets.find(a=>a.file==='styles.css').bytes<60000);assert(assets.find(a=>a.file==='script.js').bytes<16000);
 const report={checkedAt:new Date().toISOString(),framing:observations,search:['Lazy code and data',`Real index of all ${JSON.parse(fs.readFileSync('public/search-index.json','utf8')).length} resources`,'Keyboard open, result browsing, focus trap and restored opener','Text and collection search','Empty state','One index fetch per document','Full-library deep links preserve filters','Failed index request and retry','Fits 390/320 × 600'],fallbacks:['Static framing study and reference link without JavaScript','Search trigger hidden without JavaScript','No open dialog without JavaScript'],assets,pageErrors:errors,externalRequests:external,limitations:'Local Chromium checks; no campaign media, hosted publication, analytics, or real-user speed claim.'};fs.writeFileSync('docs/studio-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
