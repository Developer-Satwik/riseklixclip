// Optional asset preparation; normal builds use the checked-in PNGs.
// Only trims empty padding, scales the supplied pixels and pads square icons.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const source=process.argv[2]||path.join(root,'docs/brand/riseklix-logo-source.png');
let sharp;
try {sharp=createRequire(import.meta.url)('sharp');}
catch {sharp=createRequire('/Users/satwikkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')('sharp');}
const assets=path.join(root,'public/assets');
fs.mkdirSync(path.join(root,'docs/brand'),{recursive:true});
const original=fs.readFileSync(source);
const saved=path.join(root,'docs/brand/riseklix-logo-source.png');
if(path.resolve(source)!==saved)fs.writeFileSync(saved,original);
const mark={left:668,top:394,width:672,height:896};
const lockup={left:568,top:400,width:880,height:1200};
const files=[];
async function save(name,pipeline){
 const file=path.join(assets,name);
 await pipeline.png({compressionLevel:9,adaptiveFiltering:true}).toFile(file);
 const bytes=fs.readFileSync(file),metadata=await sharp(bytes).metadata();
 files.push({file:'assets/'+name,width:metadata.width,height:metadata.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await save('riseklix-mark.png',sharp(original).extract(mark).resize(96,128));
await save('riseklix-logo.png',sharp(original).extract(lockup).resize(264,360));
for(const size of [32,48,180]){
 const padding=Math.round(size*.12);
 await save(`riseklix-icon-${size}.png`,sharp(original).extract(mark).resize(size-padding*2,size-padding*2,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).extend({top:padding,bottom:padding,left:padding,right:padding,background:{r:255,g:255,b:255,alpha:0}}));
}
const report={preparedAt:new Date().toISOString(),source:'docs/brand/riseklix-logo-source.png',sourceBytes:original.length,sourceSha256:createHash('sha256').update(original).digest('hex'),processing:'Exact supplied artwork; crop transparent padding and resize only. No regeneration, recoloring, retouching or alpha removal.',cropBoxes:{mark,lockup},files};
fs.writeFileSync(path.join(root,'docs/brand/logo-assets.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
