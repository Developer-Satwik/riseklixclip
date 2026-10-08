const base=require('../helpers.cjs');
const scenarios=require('./worked-scenarios.cjs');
module.exports={...base,create:(slug,data)=>{
 const example=scenarios[slug];if(!example)throw Error('Missing individually authored scenario: '+slug);
 const sections=[...data.sections.slice(0,-1),base.sec(example.heading,example.text),data.sections.at(-1)];
 return base.create(slug,{...data,sections,researchBatch:2});
}};
