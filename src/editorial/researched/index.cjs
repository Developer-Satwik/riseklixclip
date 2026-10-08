const fs=require('node:fs'),path=require('node:path');
const articles=[...fs.readdirSync(__dirname).filter(file=>/^\d.*\.cjs$/.test(file)).sort().map(file=>require(path.join(__dirname,file))),...require('./round-two/index.cjs'),...require('./round-three/index.cjs')];
if(new Set(articles.map(a=>a.slug)).size!==articles.length)throw Error('Duplicate researched article URL');
module.exports=articles;
