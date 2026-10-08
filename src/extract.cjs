const fs=require('fs'),vm=require('vm'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'original-generator.cjs'),'utf8');
const context={require,__dirname:path.join(__dirname,'../public')};
vm.createContext(context);
vm.runInContext(source.slice(0,source.indexOf('writeFile("index.html", indexPage());'))+'\nglobalThis.data={allArticles,sourceCatalog};globalThis.legal={privacy:privacyPage(),terms:termsPage(),"data-deletion":dataDeletionPage(),docs:docsPage()};',context);
fs.writeFileSync(path.join(__dirname,'articles-original.json'),JSON.stringify(context.data,null,2));
fs.writeFileSync(path.join(__dirname,'utility-original.json'),JSON.stringify(context.legal,null,2));
console.log(context.data.allArticles.map(x=>`${x.section}/${x.slug}: ${x.title} [${Object.keys(x).join(',')}]`).join('\n'));
