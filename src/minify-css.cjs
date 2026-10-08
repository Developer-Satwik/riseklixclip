// Preserve quoted content and required spaces in values such as calc().
module.exports=css=>{
 const strings=[];
 return css.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,value=>'\u0001'+(strings.push(value)-1)+'\u0002')
  .replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1')
  .replace(/\u0001(\d+)\u0002/g,(_,index)=>strings[Number(index)]).trim();
};
