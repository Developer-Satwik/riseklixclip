const fs=require('fs'),path=require('path');
const articles={};
for(const file of fs.readdirSync(__dirname).filter(f=>/^\d.*\.cjs$/.test(f)).sort()){
 for(const [slug,data] of require(path.join(__dirname,file))){
  if(articles[slug])throw Error('Duplicate expanded article '+slug);
  articles[slug]=data;
 }
}
for(const [slug,depth] of Object.entries(require('./depth/index.cjs'))){
 if(!articles[slug])throw Error('Detailed revision has no article: '+slug);
 const a=articles[slug];
 a.sections=[...a.sections,...depth.sections];
 a.faq=[...a.faq,...(depth.faq||[])];
 a.depthRevision=true;
 a.depthPurpose=depth.intent;
}
module.exports=articles;
