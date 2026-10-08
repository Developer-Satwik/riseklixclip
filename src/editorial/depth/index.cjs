const fs=require('node:fs'),path=require('node:path');
const revisions={};
for(const file of fs.readdirSync(__dirname).filter(f=>/^\d.*\.cjs$/.test(f)).sort()){
 for(const [slug,data] of require(path.join(__dirname,file))){
  if(revisions[slug])throw Error('Duplicate detailed revision: '+slug);
  revisions[slug]=data;
 }
}
module.exports=revisions;
