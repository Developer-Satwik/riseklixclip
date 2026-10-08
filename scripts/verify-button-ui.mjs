import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';

const origin='http://127.0.0.1:8770',article='/guides/how-to-become-a-clipper-india.html';
const browser=await chromium.launch({channel:'chrome',headless:true});
const layouts=[],states=[],errors=[],external=[];
const screenshots='docs/screenshots/button-ui';fs.mkdirSync(screenshots,{recursive:true});
const watch=page=>{page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(!request.url().startsWith(origin))external.push(request.url());});};
const settle=page=>page.waitForTimeout(210);
async function scrollStill(page){await page.waitForFunction(()=>{
 const key=scrollX+','+scrollY,now=performance.now();
 if(window.__qaButtonScroll?.key===key)return now-window.__qaButtonScroll.since>150;
 window.__qaButtonScroll={key,since:now};return false;
},undefined,{timeout:5000,polling:50});}
async function snapshot(control){return control.evaluate(element=>{
 const css=getComputedStyle(element),rect=element.getBoundingClientRect();
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d',{willReadFrequently:true});
 const ancestors=[];for(let node=element;node;node=node.parentElement)ancestors.unshift(node);
 context.fillStyle='#fff';context.fillRect(0,0,1,1);
 for(const ancestor of ancestors){context.fillStyle=getComputedStyle(ancestor).backgroundColor;context.fillRect(0,0,1,1);}
 const background=[...context.getImageData(0,0,1,1).data].slice(0,3);
 context.clearRect(0,0,1,1);context.fillStyle=css.color;context.fillRect(0,0,1,1);
 const foreground=[...context.getImageData(0,0,1,1).data].slice(0,3);
 const luminance=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const [a,b]=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
 const arrow=element.querySelector(':scope > span[aria-hidden="true"]');
 return {label:element.textContent.trim(),background:css.backgroundColor,color:css.color,contrast:(a+.05)/(b+.05),opacity:css.opacity,rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},radius:css.borderRadius,shadow:css.boxShadow,outline:{style:css.outlineStyle,width:css.outlineWidth,color:css.outlineColor},focused:element.matches(':focus-visible'),arrow:arrow?getComputedStyle(arrow).transform:null,transition:css.transitionDuration,cursor:css.cursor};
 });}
function readable(sample,label){assert(sample.contrast>=4.5,`${label}: text contrast ${sample.contrast.toFixed(2)} is below 4.5:1`);}
function stationary(before,after,label){for(const key of ['x','y','width','height'])assert(Math.abs(before.rect[key]-after.rect[key])<.2,`${label}: hover moved target ${key}`);}
async function checkStates(page,selector,theme){
 const control=page.locator(selector).first();
 if(selector.startsWith('.frame-formats')||selector.startsWith('#frame-'))await page.locator('#framing-studio').scrollIntoViewIfNeeded();
 if(selector==='[data-copy-brief]'||selector==='.tool-actions button[type="reset"]'){
  if(!await page.locator('.campaign-workbook').evaluate(el=>el.open))await page.locator('.campaign-workbook > summary').click();
 }
 await control.waitFor({state:'visible',timeout:5000});await control.scrollIntoViewIfNeeded();await scrollStill(page);await page.mouse.move(0,0);await settle(page);
 const normal=await snapshot(control);readable(normal,`${selector} ${theme} normal`);assert(normal.rect.height>=44,`${selector} target height`);
 await page.mouse.move(normal.rect.x+normal.rect.width/2,normal.rect.y+normal.rect.height/2);await settle(page);const hover=await snapshot(control);readable(hover,`${selector} ${theme} hover`);stationary(normal,hover,selector);
 await page.mouse.down();await page.waitForTimeout(80);const pressed=await snapshot(control);readable(pressed,`${selector} ${theme} pressed`);stationary(normal,pressed,selector);
 await page.mouse.move(0,0);await page.mouse.up();await page.keyboard.press('Tab');await control.focus();await settle(page);
 const focus=await snapshot(control);readable(focus,`${selector} ${theme} focus`);assert(focus.focused&&focus.outline.style==='solid'&&parseFloat(focus.outline.width)>=3,`${selector} visible keyboard outline`);
 states.push({selector,theme,normal,hover,pressed,focus});
}

try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();watch(page);
 for(const route of ['/', '/resources/', '/contact/',article])for(const width of [320,390,820,1100,1440])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1000});await page.goto(origin+route);await page.selectOption('.theme-select',theme);await page.evaluate(()=>document.fonts.ready);await settle(page);
  const layout=await page.evaluate(()=>{
   const header=[...document.querySelectorAll('.site-header > *')].filter(el=>getComputedStyle(el).display!=='none').map(el=>({class:el.className,rect:el.getBoundingClientRect().toJSON()}));
   const controls=[...document.querySelectorAll('button,.button,.clipper-nav,.nav-cta')].filter(el=>el.getClientRects().length&&!el.closest('dialog:not([open])')).map(el=>({label:el.textContent.trim(),height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}));
   return {overflow:document.documentElement.scrollWidth>innerWidth,header,controls,join:document.querySelector('.clipper-nav').getBoundingClientRect().toJSON()};
  });
  assert(!layout.overflow,`${route} ${width} ${theme} horizontal overflow`);
  for(const control of layout.controls)assert(control.height>=44,`${route} ${width} target too short: ${control.label}`);
  assert(layout.join.height>=44&&layout.join.top>=0&&layout.join.bottom<1000,'Header invite remains above fold');
  const header=layout.header.filter(item=>item.rect.width>0);
  for(let i=0;i<header.length;i++)for(let j=i+1;j<header.length;j++){
   const a=header[i].rect,b=header[j].rect;assert(!(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1),'Header controls overlap');
  }
  layouts.push({route,width,theme,...layout});
  if((width===390||width===1440)&&(route==='/'||route==='/contact/'))await page.screenshot({path:`${screenshots}/${route==='/'?'home':'contact'}-${width}-${theme}.png`});
 }
 console.log(`Passed ${layouts.length} light/dark responsive layouts.`);
 await page.setViewportSize({width:1440,height:1000});
 const families={
  '/':['.hero-actions .button.white','.hero-actions .discord-button','.clipper-nav','.site-header .nav-cta','.search-trigger','.cut-switcher button[aria-pressed="false"]','.cut-switcher button[aria-pressed="true"]','.frame-formats button[aria-pressed="false"]','.frame-formats button[aria-pressed="true"]','#frame-guide-toggle','#frame-reset','.save-resource'],
  '/resources/':['[data-library-view="grid"]','[data-library-view="list"]','#saved-filter','.save-resource'],
  '/contact/':['[data-send-enquiry]','.campaign-clipper .button','[data-copy-brief]','.tool-actions button[type="reset"]'],
  [article]:['.reader-tools .save-resource','[data-copy-link]','.reading-jump button']
 };
 for(const [route,selectors]of Object.entries(families))for(const theme of ['light','dark']){
  await page.goto(origin+route);await page.selectOption('.theme-select',theme);await page.evaluate(()=>document.fonts.ready);await settle(page);
  for(const selector of selectors)await checkStates(page,selector,theme);
 }
 // Native keyboard activation and persistent selected states.
 await page.goto(origin+'/');await page.locator('[data-cut-select="founder"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-cut-select="founder"]').getAttribute('aria-pressed'),'true');
 await page.locator('#framing-studio').scrollIntoViewIfNeeded();await page.locator('[data-frame-format="portrait"]').waitFor({state:'visible',timeout:5000});await page.locator('[data-frame-format="portrait"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('[data-frame-format="portrait"]').getAttribute('aria-pressed'),'true');
 await page.locator('.search-trigger').click();await page.locator('#quick-search[open]').waitFor();
 for(const theme of ['light','dark']){await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await checkStates(page,'.search-close',theme);}
 await page.locator('.search-close').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#quick-search').evaluate(el=>el.open),false);assert.equal(await page.locator('.search-trigger').evaluate(el=>el===document.activeElement),true);
 await page.goto(origin+'/resources/');await page.locator('[data-library-view="list"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.resource-grid').getAttribute('data-view'),'list');
 const save=page.locator('.save-resource').first();await save.focus();await page.keyboard.press('Space');assert.equal(await save.getAttribute('aria-pressed'),'true');assert.match(await save.innerText(),/Saved/);
 await page.locator('#saved-filter').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.resource-grid .resource-card:not([hidden])').count(),1);
 await page.goto(origin+article);const contentsOpen=await page.locator('.toc-menu').evaluate(el=>el.open);await page.locator('.toc-menu summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.toc-menu').evaluate(el=>el.open),!contentsOpen);await page.locator('.faq-list summary').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.faq-list details').first().evaluate(el=>el.open),true);
 console.log(`Passed ${states.length} button-family state comparisons and keyboard actions.`);

 // An isolated, explicitly marked demonstration exercises the real sending/recovery UI.
 await page.goto(origin+'/contact/');await page.waitForFunction(()=>document.querySelector('#campaign-enquiry').noValidate);
 const originalMarkup=await page.locator('[data-send-enquiry]').innerHTML();let release;const heldResponse=new Promise(resolve=>{release=resolve;});
 await page.route('**/api/campaign-enquiry',async route=>{await heldResponse;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({state:'unconfirmed',message:'QA DEMONSTRATION: no email sent; recovery state.'})});});
 for(const [name,value]of Object.entries({name:'QA DEMONSTRATION',email:'qa@example.com',goal:'DEMONSTRATION ONLY — no live campaign or email.'}))await page.locator(`#enquiry-${name}`).fill(value);
 await page.locator('[data-send-enquiry]').click();await page.waitForFunction(()=>document.querySelector('[data-send-enquiry]').disabled);
 const busy=[];
 for(const theme of ['light','dark']){
  await page.selectOption('.theme-select',theme);await settle(page);const control=page.locator('[data-send-enquiry]'),normal=await snapshot(control);
  assert.match(normal.label,/Sending enquiry/);assert.equal(normal.cursor,'wait');assert.equal(normal.opacity,'1');readable(normal,'Busy label');await control.hover({force:true});await settle(page);const hovered=await snapshot(control);assert.equal(hovered.background,normal.background);assert.equal(hovered.shadow,'none');busy.push({theme,normal,hovered});
 }
 release();await page.waitForFunction(()=>!document.querySelector('[data-send-enquiry]').disabled);assert.equal(await page.locator('[data-send-enquiry]').innerHTML(),originalMarkup,'Recovery restores the arrow and accessible decorative markup');assert.equal(await page.locator('#enquiry-email').inputValue(),'qa@example.com');
 await page.unroute('**/api/campaign-enquiry');

 // Pointer-specific hover, immediate touch press and reduced-motion behavior.
 const touchContext=await browser.newContext({viewport:{width:390,height:850},isMobile:true,hasTouch:true}),touch=await touchContext.newPage();watch(touch);await touch.goto(origin+'/');
 assert.equal(await touch.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches),false);
 const touchControl=touch.locator('.hero-actions .button.white');await touchControl.scrollIntoViewIfNeeded();await settle(touch);const touchNormal=await snapshot(touchControl);await touchControl.hover();await settle(touch);const touchHover=await snapshot(touchControl);assert.equal(touchNormal.background,touchHover.background);assert.equal(touchHover.arrow,'none');
 // Chromium applies :active during a completed tap rather than a held touchstart.
 // Cancel this test's destination so the painted feedback can be inspected.
 await touchControl.evaluate(element=>element.addEventListener('click',event=>event.preventDefault(),{once:true}));
 const touchSession=await touchContext.newCDPSession(touch),touchBox=await touchControl.boundingBox();
 await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchBox.x+touchBox.width/2,y:touchBox.y+touchBox.height/2,radiusX:1,radiusY:1,force:1}]});
 await touchSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await touch.waitForFunction(background=>getComputedStyle(document.querySelector('.hero-actions .button.white')).backgroundColor!==background,touchNormal.background,{timeout:1000});
 const touchPressed=await snapshot(touchControl);assert.notEqual(touchPressed.background,touchNormal.background);readable(touchPressed,'Native touch feedback');stationary(touchNormal,touchPressed,'Native touch');
 const reduceContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),reduce=await reduceContext.newPage();watch(reduce);await reduce.goto(origin+'/');await reduce.locator('.hero-actions .discord-button').hover();await settle(reduce);const reduced=await snapshot(reduce.locator('.hero-actions .discord-button'));assert.equal(reduced.arrow,'none');assert.equal(reduced.transition,'0s');
 const forcedContext=await browser.newContext({viewport:{width:1440,height:1000},forcedColors:'active'}),forced=await forcedContext.newPage();watch(forced);await forced.goto(origin+'/');await forced.keyboard.press('Tab');await forced.locator('.clipper-nav').focus();const forcedStyle=await forced.locator('.clipper-nav').evaluate(el=>({focus:el.matches(':focus-visible'),outline:getComputedStyle(el).outlineStyle,border:getComputedStyle(el).borderTopStyle}));assert(forcedStyle.focus&&forcedStyle.outline==='solid'&&forcedStyle.border==='solid');
 const nojsContext=await browser.newContext({viewport:{width:390,height:850},javaScriptEnabled:false}),nojs=await nojsContext.newPage();watch(nojs);await nojs.goto(origin+'/');assert.equal(await nojs.locator('.clipper-nav').getAttribute('href'),'https://discord.gg/skQk3xZcRa');assert.equal(await nojs.locator('.hero-actions .discord-button').getAttribute('href'),article);assert.equal(await nojs.locator('.hero-actions .button.white').getAttribute('href'),'/contact/');assert.equal(await nojs.locator('.clipper-nav').evaluate(el=>getComputedStyle(el).borderRadius),'10px');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const assets=Object.fromEntries(['styles.css','script.js','button-ui.css','campaign-enquiry.js'].map(file=>{const bytes=fs.readFileSync('public/'+file);return[file,{bytes:bytes.length,gzip:gzipSync(bytes).length}];}));
 assert(assets['styles.css'].bytes<=60000&&assets['script.js'].bytes<=16000&&assets['button-ui.css'].bytes<=8000);
 const report={date:'2026-10-08',origin,layouts,states,busy,touch:{normal:touchNormal,hover:touchHover,pressed:touchPressed},reduced,forcedStyle,assets,keyboardActions:'Example, format, search close/return focus, library view/save/filter, native contents and FAQ passed.',noJavaScript:'Native campaign and Discord/guide links retained; shared CSS available.',errors,external,limits:'Local Chromium checks. Text contrast composites CSS ancestor surfaces, not background-image pixels. Busy flow used an isolated QA response and sent no email. No production conversion, full WCAG or field performance claim.'};
 fs.writeFileSync('docs/button-ui-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({layouts:layouts.length,stateFamilies:states.length,minContrast:Math.min(...states.flatMap(s=>[s.normal.contrast,s.hover.contrast,s.pressed.contrast,s.focus.contrast])),assets,errors,external}));
}finally{await browser.close();}
