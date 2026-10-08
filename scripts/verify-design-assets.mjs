import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import editorial from '../src/content.cjs';

const source=fs.readFileSync('src/styles.css','utf8'),compiled=fs.readFileSync('public/styles.css','utf8');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const issues=[];
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',e=>issues.push(e.message));
 await page.goto('http://127.0.0.1:8770/');
 const css=await page.evaluate(({source,compiled})=>{
  const a=new CSSStyleSheet(),b=new CSSStyleSheet();a.replaceSync(source);b.replaceSync(compiled);
  const before=[...a.cssRules].map(rule=>rule.cssText),after=[...b.cssRules].map(rule=>rule.cssText);
  return {sourceRules:before.length,compiledRules:after.length,mismatches:before.flatMap((rule,index)=>rule===after[index]?[]:[{index,before:rule,after:after[index]}])};
 },{source,compiled});
 assert.equal(css.sourceRules,css.compiledRules);assert.deepEqual(css.mismatches,[]);
 const articles=[];
 for(const directory of ['guides','compare','platforms','blog']) {
  const root=path.join('public',directory);if(!fs.existsSync(root))continue;
  for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.html')&&file!=='index.html')){
   const html=fs.readFileSync(path.join(root,file),'utf8');
   if(!html.includes('class="article-hero'))continue;
   assert.match(html,/<img src="\/assets\/story-collage-v3-640.webp"[^>]*loading="eager"[^>]*fetchpriority="high"/);
   assert.equal((html.match(/<link rel="preload" href="\/assets\/story-collage-v3-640.avif"/g)||[]).length,1);
   articles.push(directory+'/'+file);
  }
 }
 assert.equal(articles.length,editorial.articles.length);
 for(const width of [1440,820,390,320])for(const route of ['/','/resources/','/compare/video-clipping-vs-video-editing-vs-ugc-india.html']){
  await page.setViewportSize({width,height:844});await page.goto('http://127.0.0.1:8770'+route);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.equal(await page.locator('h1').count(),1);
  if(route.includes('.html')){
   assert.equal(await page.locator('.article-art img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
   assert.equal(await page.locator('.toc-menu').evaluate(el=>el.open),width>820);
  }
 }
 assert.deepEqual(issues,[]);
 const report={checkedAt:new Date().toISOString(),css,articlePriorityChecks:articles.length,layouts:{widths:[1440,820,390,320],routes:3,noOverflow:true,imagesDecoded:true,mobileContentsCollapsed:true},assets:['styles.css','script.js'].map(file=>{const bytes=fs.readFileSync('public/'+file);return {file,bytes:bytes.length,gzipEstimateBytes:gzipSync(bytes).length}}),pageErrors:issues};
 fs.writeFileSync('docs/design-assets-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
