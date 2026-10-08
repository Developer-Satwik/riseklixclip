const fs=require('node:fs'),path=require('node:path');
module.exports=fs.readdirSync(__dirname).filter(file=>/^\d.*\.cjs$/.test(file)).sort().map(file=>require(path.join(__dirname,file)));
