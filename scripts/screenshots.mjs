import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../docs/screenshots/',import.meta.url));fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
for(const [name,route] of [['home','/'],['resources','/resources/'],['article','/guides/creator-clipping-campaign-guide-india.html'],['calculator','/blog/creator-clipping-campaign-roi-calculator-india.html'],['contact','/contact/'],['privacy','/privacy/']]){await page.goto('http://127.0.0.1:8770'+route);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:dir+name+'-desktop.png',fullPage:true});}
await page.setViewportSize({width:390,height:844});
for(const [name,route] of [['home','/'],['resources','/resources/'],['article','/guides/creator-clipping-campaign-guide-india.html'],['contact','/contact/']]){await page.goto('http://127.0.0.1:8770'+route);await page.screenshot({path:dir+name+'-mobile.png',fullPage:true});}
await page.goto('http://127.0.0.1:8770/');await page.selectOption('.theme-select','dark');await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:dir+'home-dark.png',fullPage:true});
await browser.close();console.log('11 screenshots saved.');
