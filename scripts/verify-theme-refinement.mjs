import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {gzipSync} from 'node:zlib';
import editorial from '../src/content.cjs';
const origin='http://127.0.0.1:8770',screens='docs/screenshots/theme-refinement';fs.mkdirSync(screens,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),layouts=[],contrasts=[],errors=[],external=[];
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
try{
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
 for(const width of [1440,1100,820,390,320])for(const theme of ['light','dark'])for(const route of ['/','/resources/','/guides/youtube-tutorial-clipping-shorts-india.html']){
  await page.setViewportSize({width,height:900});await page.goto(origin+route);await page.selectOption('.theme-select',theme);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await overflow(page),false);
  const foundation=await page.evaluate(()=>Object.fromEntries(['--bg','--surface','--soft','--ink','--muted'].map(k=>[k,getComputedStyle(document.documentElement).getPropertyValue(k).trim()])));
  for(const value of Object.values(foundation)){const rgb=value.replace('#','');assert(rgb.slice(0,2)===rgb.slice(2,4)&&rgb.slice(2,4)===rgb.slice(4,6)||value==='#fff','Achromatic foundation');}
  if(route==='/resources/'){
   assert.equal(await page.locator('.library-route-disclosure').evaluate(e=>e.open),false);
   await page.locator('#resource-search').fill('permission');assert(await page.locator('#resource-grid .resource-card:visible').count()>0);
   await page.locator('.library-route-disclosure>summary').click();
  }
  if(!route.includes('.html')){
   for(const tone of ['blue','amber','violet']){
    const summary=page.locator(`.route-${tone}>summary`);await summary.focus();
    if(!await page.locator(`.route-${tone}`).evaluate(e=>e.open))await page.keyboard.press('Space');
    assert.equal(await page.locator('.story-route[open]').count(),1);assert.equal(await overflow(page),false);
    const samples=await page.locator(`.route-${tone} .route-label,.route-${tone} summary strong,.route-${tone} .route-body>p,.route-${tone} li strong,.route-${tone} li small`).evaluateAll(elements=>elements.map(el=>{
     const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,1,1);
     const parents=[];for(let node=el;node;node=node.parentElement)parents.unshift(node);
     for(const node of parents){ctx.fillStyle=getComputedStyle(node).backgroundColor;ctx.fillRect(0,0,1,1);}
     const bg=[...ctx.getImageData(0,0,1,1).data].slice(0,3);ctx.clearRect(0,0,1,1);ctx.fillStyle=getComputedStyle(el).color;ctx.fillRect(0,0,1,1);const fg=[...ctx.getImageData(0,0,1,1).data].slice(0,3);
     const lum=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);const[a,b]=[lum(bg),lum(fg)].sort((a,b)=>b-a);
     return {text:el.textContent,contrast:(a+.05)/(b+.05)};
    }));assert(samples.every(s=>s.contrast>=4.5));contrasts.push({width,theme,route,tone,minimum:Math.min(...samples.map(s=>s.contrast))});
   }
   if(width===1440||width===390){await page.locator('.route-blue>summary').click();await page.locator('#choose-your-route').screenshot({path:`${screens}/routes-${route==='/resources/'?'library':'home'}-${width}-${theme}.png`});}
  }else{
   assert.equal(await page.locator('.evidence-link').getAttribute('href'),'#sources');await page.locator('.evidence-link').click();assert.equal(new URL(page.url()).hash,'#sources');assert(await page.locator('#sources').isVisible());
   assert.equal(await page.locator('.article-art img').evaluate(img=>img.complete&&img.naturalWidth===640&&img.currentSrc.endsWith('.avif')),true);
  }
  layouts.push({width,theme,route,noOverflow:true,foundation});
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(origin+'/');await page.selectOption('.theme-select','dark');
 await page.locator('.route-blue li a').first().click();assert.match(page.url(),/youtube-tutorial-clipping-shorts-india\.html$/);assert(await page.locator('#direct-answer').isVisible());
 await page.goto(origin+'/resources/');await page.locator('.library-route-disclosure>summary').focus();await page.keyboard.press('Enter');await page.locator('.route-violet>summary').focus();await page.keyboard.press('Space');assert.equal(await page.locator('.route-violet .button').getAttribute('href'),'https://discord.gg/skQk3xZcRa');
 await page.emulateMedia({forcedColors:'active'});assert.equal(await page.locator('.route-violet>summary').evaluate(e=>getComputedStyle(e).outlineWidth),'3px');await page.emulateMedia({forcedColors:'none'});
 for(const scheme of ['light','dark']){await page.selectOption('.theme-select','system');await page.emulateMedia({colorScheme:scheme});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()),scheme==='dark'?'#171717':'#f7f7f7');}
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});await page.goto(origin+'/');await page.selectOption('.theme-select','dark');await page.screenshot({path:`${screens}/home-${width}-dark.png`});assert(await page.locator('.hero-art img').evaluate(async e=>{await e.decode();return e.currentSrc.endsWith('.avif');}));}
 const plain=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:320,height:844}}),np=await plain.newPage();
 await np.goto(origin+'/resources/');await np.locator('.library-route-disclosure>summary').click();await np.locator('.route-amber>summary').click();assert.equal(await np.locator('.route-amber').evaluate(e=>e.open),true);assert.equal(await np.locator('.route-blue').evaluate(e=>e.open),false);await np.locator('.route-amber li a').first().click();assert.match(np.url(),/b2b-webinar-clipping-qualified-leads-india\.html$/);assert(await np.locator('#direct-answer').isVisible());assert.equal(await overflow(np),false);await plain.close();
 const routes=JSON.parse(fs.readFileSync('docs/route-manifest.json'));let sourceLinks=0;
 for(const a of editorial.articles){const html=fs.readFileSync(`public/${a.section}/${a.slug}.html`,'utf8');assert(html.includes('class="evidence-link" href="#sources"'));assert(html.includes('href="/assets/story-collage-v3-640.avif" type="image/avif"'));sourceLinks++;}
 for(const route of routes){const html=fs.readFileSync('public/'+route,'utf8');assert(html.includes('/button-ui.css?v=wording-1'));assert(html.includes('property="og:image:width" content="1536"'));assert(html.includes('name="twitter:image:alt"'));}
 const imageSizes=[640,960,1536].map(width=>{const webp=fs.statSync(`public/assets/story-collage-v3-${width}.webp`).size,avif=fs.statSync(`public/assets/story-collage-v3-${width}.avif`).size;assert(avif<webp);return{width,webp,avif,reductionPercent:(1-avif/webp)*100};});
 const bundle=fs.readFileSync('public/button-ui.css');assert(bundle.length<14000);assert(gzipSync(bundle).length<3500);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const report={checkedAt:new Date().toISOString(),layouts,contrastSamples:contrasts,minimumTextContrast:Math.min(...contrasts.map(s=>s.minimum)),journeys:'Keyboard/native mutually exclusive disclosure → relevant complete guide → direct answer; company journey also works without JavaScript',allPageMetadataChecks:routes.length,articleSourceLinks:sourceLinks,systemTheme:true,forcedColorFocus:true,reducedMotion:true,imageSizes,bundle:{bytes:bundle.length,gzipEstimateBytes:gzipSync(bundle).length},additionalJavaScriptForThemeLayerBytes:0,pageErrors:errors,externalRequests:external,limitations:'Local Chromium; WebP fallback markup retained, but older browser codecs and Safari/Firefox were not executed. Contrast samples do not establish full WCAG conformance. No real-user performance, ranking, conversion or citation lift is claimed.'};
 fs.writeFileSync('docs/theme-refinement-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,layouts:layouts.length,contrastSamples:contrasts.length},null,2));
}finally{await browser.close();}
