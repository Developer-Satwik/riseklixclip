import {chromium} from '/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const dir='docs/screenshots/interactive-atelier';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.setDefaultTimeout(60000);
 const ready=async route=>{await page.goto('http://127.0.0.1:8770'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>document.activeElement?.blur());};
 await ready('/');await page.selectOption('.theme-select','light');await page.screenshot({path:dir+'/home-desktop.png'});
 await page.locator('#cutting-desk').screenshot({path:dir+'/cutting-desk-desktop.png'});
 await page.setViewportSize({width:390,height:844});await ready('/');await page.selectOption('.theme-select','dark');await page.screenshot({path:dir+'/home-mobile-dark.png'});
 await page.locator('#cutting-desk').screenshot({path:dir+'/cutting-desk-mobile-dark.png'});
 await page.evaluate(()=>scrollTo(0,document.querySelector('#cutting-desk').getBoundingClientRect().top+scrollY));await page.screenshot({path:dir+'/cutting-desk-mobile-viewport-dark.png'});
 await ready('/resources/');await page.locator('[data-library-view=list]').click();await page.locator('.library-tools').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/library-index-mobile-dark.png'});
 await ready('/compare/video-clipping-vs-video-editing-vs-ugc-india.html');await page.screenshot({path:dir+'/article-mobile-dark.png'});
 await page.locator('.reader-tools').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/article-reading-mobile-dark.png'});
 await page.setViewportSize({width:1440,height:1000});await page.selectOption('.theme-select','light');await ready('/compare/video-clipping-vs-video-editing-vs-ugc-india.html');await page.screenshot({path:dir+'/article-desktop.png'});
 console.log('Saved nine final representative views.');
}finally{await browser.close();}
