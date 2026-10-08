const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),{articles}=require('../src/content.cjs');
const batch=Number(process.argv[2]||1);assert([1,2,3].includes(batch));
const allResearched=articles.filter(a=>a.researchedArticle),newArticles=allResearched.filter(a=>(a.researchBatch||1)===batch),oldArticles=articles.filter(a=>!newArticles.some(n=>n.slug===a.slug));
const roundTwo=require('../src/editorial/researched/round-two/plan.cjs'),roundThree=require('../src/editorial/researched/round-three/plan.cjs');
const cohortPlan=batch===3?roundThree:roundTwo;
const dateLabel=batch===3?'8 October 2026':'7 October 2026';
const verificationName=batch===3?'research-round-three-verification':batch===2?'research-round-two-verification':'researched-article-verification';
const researchName=batch===3?'research-round-three-2026-10-08.md':batch===2?'research-round-two-2026-10-07.md':'new-article-research-2026-10-07.md';
const reportPrefix=batch===3?'research-round-three-report':batch===2?'research-round-two-report':'new-articles-report';
const firstExpected=['does-clipping-work-in-india','clipping-campaign-pricing-budget-india','is-video-clipping-legal-in-india','how-to-check-clipping-campaign-legit-india','how-to-choose-clipping-agency-india','ai-clipping-tools-vs-clipping-marketplaces','youtube-reused-content-rules-indian-clippers','utm-tracking-clipping-campaigns-india','accessible-captions-short-form-clips-india','clipping-campaign-case-study-evidence-template'];
const expected=batch>1?cohortPlan.map(row=>row[0]):firstExpected;
assert.equal(articles.filter(a=>!a.researchedArticle).length,93);assert.deepEqual(newArticles.map(a=>a.slug),expected);assert.equal(articles.length,93+allResearched.length);
const slugs=new Set(articles.map(a=>a.slug));assert.equal(slugs.size,articles.length);
const count=parts=>parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
const readingWords=a=>count([a.answer,...a.sections.flatMap(s=>[s.heading,...s.paragraphs,...s.points,...(s.table?[s.table.headers.join(' '),...s.table.rows.map(r=>r.join(' '))]:[])]),...a.faq.flat()]);
const paragraphs=new Map(),issues=[];
for(const a of articles)for(const s of a.sections){
 for(const p of s.paragraphs){const key=p.toLowerCase().replace(/\s+/g,' ').trim();if(!paragraphs.has(key))paragraphs.set(key,[]);paragraphs.get(key).push(a.slug)}
 for(const l of s.links||[])if(!slugs.has(l.slug))issues.push([a.slug,'Missing contextual target',l.slug]);
}
const duplicates=[...paragraphs].filter(([,slugs])=>slugs.length>1).map(([paragraph,slugs])=>({paragraph,slugs}));
if(duplicates.length)issues.push(['library','Repeated full body paragraphs',duplicates.length]);
const backlinks=target=>oldArticles.flatMap(a=>a.sections.flatMap(s=>(s.links||[]).filter(l=>l.slug===target).map(()=>a.slug)));
const firstTargets={
 'does-clipping-work-in-india':['does clipping work in india','clipping in india'],
 'clipping-campaign-pricing-budget-india':['indian clipping campaign','clipping campaign india'],
 'is-video-clipping-legal-in-india':['clipping for india','is whop clipping legal in india'],
 'how-to-check-clipping-campaign-legit-india':['legit','clipping jobs','clipping campaign discord'],
 'how-to-choose-clipping-agency-india':['how to choose a clipping agency','indian clipping agency'],
 'ai-clipping-tools-vs-clipping-marketplaces':['clipping tool','clipping marketplace','clipping platform'],
 'youtube-reused-content-rules-indian-clippers':['creator clipping','clipping for indian creators'],
 'utm-tracking-clipping-campaigns-india':['clipping campaign','founder brand clipping'],
 'accessible-captions-short-form-clips-india':['indian creators','regional-language clipping support'],
 'clipping-campaign-case-study-evidence-template':['clipping agency reviews','how successful is it']
};
const targets=batch>1?Object.fromEntries(cohortPlan.map(([slug,queries])=>[slug,queries])):firstTargets;
const rows=newArticles.map(a=>{
 const file=`${a.section}/${a.slug}.html`,html=fs.readFileSync(path.join(root,'public',file),'utf8');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(s=>s['@type']==='Article');
 if(schema.wordCount!==readingWords(a))issues.push([a.slug,'wordCount mismatch']);
 if(schema.dateCreated!==a.createdDate||schema.datePublished)issues.push([a.slug,'Local draft must have actual creation date and no backdated publication']);
 if(!html.includes(`Written <time datetime="${a.createdDate}">${dateLabel}</time>`))issues.push([a.slug,'Incorrect visible creation date']);
 if(a.modifiedDate&&schema.dateModified!==a.modifiedDate)issues.push([a.slug,'Incorrect modification date']);
 if(a.editorialMethod&&!html.includes(a.editorialMethod))issues.push([a.slug,'Missing visible editorial method']);
 if(a.sections.length<12||a.faq.length<6||readingWords(a)<1400)issues.push([a.slug,'Incomplete long-form coverage']);
 if(schema.description!==a.description)issues.push([a.slug,'Custom description missing']);
 if(!a.intent||!a.dek||!a.answer||!a.description)issues.push([a.slug,'Incomplete editorial purpose or metadata']);
 const headings=a.sections.map(s=>s.heading.toLowerCase()),questions=a.faq.map(q=>q[0].toLowerCase());
 if(new Set(headings).size!==headings.length||new Set(questions).size!==questions.length)issues.push([a.slug,'Repeated section or question']);
 if(!a.references.length||!a.sections.some(s=>s.table)||!backlinks(a.slug).length)issues.push([a.slug,'Missing sources, practical table or contextual inbound link']);
 for(const s of a.sections){
  if(!s.heading||!s.paragraphs.length||s.paragraphs.some(p=>!p.trim()))issues.push([a.slug,'Incomplete section',s.heading]);
  if(s.table&&s.table.rows.some(row=>row.length!==s.table.headers.length))issues.push([a.slug,'Malformed table',s.heading]);
  for(const [title,url] of s.references||[])if(!title||new URL(url).protocol!=='https:')issues.push([a.slug,'Malformed reference',url]);
 }
 if(a.faq.some(q=>q.length!==2||q.some(v=>typeof v!=='string'||!v.trim())))issues.push([a.slug,'Malformed FAQ']);
 return {slug:a.slug,title:a.title,route:'/'+file,targetQueries:targets[a.slug],intent:a.intent,readingWords:readingWords(a),sections:a.sections.length,faqs:a.faq.length,tables:a.sections.filter(s=>s.table).length,metadataCharacters:a.description.length,references:a.references.map(([title,url])=>({title,url})),contextualInboundArticles:[...new Set(backlinks(a.slug))],contextualOutgoingLinks:a.sections.flatMap(s=>s.links||[]).map(l=>l.slug)};
});
const routes=JSON.parse(fs.readFileSync(path.join(root,'docs/route-manifest.json'),'utf8'));
const original=JSON.parse(fs.readFileSync(path.join(root,'docs/original-route-manifest.json'),'utf8'));
assert.deepEqual([...routes].sort(),[...original,...allResearched.map(a=>`${a.section}/${a.slug}.html`)].sort());
const report={checkedAt:new Date().toISOString(),researchBatch:batch,newArticles:newArticles.length,totalArticles:articles.length,totalPages:routes.length,originalRoutesPreserved:original.length,newReadingWords:{min:Math.min(...rows.map(a=>a.readingWords)),max:Math.max(...rows.map(a=>a.readingWords)),total:rows.reduce((sum,a)=>sum+a.readingWords,0)},newSections:rows.reduce((n,a)=>n+a.sections,0),newFAQs:rows.reduce((n,a)=>n+a.faqs,0),newTables:rows.reduce((n,a)=>n+a.tables,0),newUniquePrimaryReferenceURLs:new Set(rows.flatMap(a=>a.references.map(r=>r.url))).size,contextualInboundLinks:rows.reduce((n,a)=>n+a.contextualInboundArticles.length,0),duplicates,issues,articles:rows};
fs.writeFileSync(path.join(root,`docs/${reportPrefix}.json`),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(root,`docs/${reportPrefix}.md`),`# Research expansion ${batch}: ${newArticles.length} resources

Research and writing date: ${dateLabel}. **${newArticles.length} new articles, ${report.newReadingWords.min}–${report.newReadingWords.max} reading words each**, ${report.newReadingWords.total.toLocaleString('en-IN')} words in total. They add ${report.newSections} substantive sections, ${report.newFAQs} FAQs and ${report.newTables} practical tables. Counts include answers, headings, body, lists, table cells and FAQs; they measure coverage, not an SEO word-count target.

The library now contains **${articles.length} articles across ${routes.length} pages**. All ${original.length} original routes remain. The new cohort has ${report.contextualInboundLinks} contextual inbound connections from other articles. Pages appear in the resource index, their collection, breadcrumbs, related reading and sitemap. Local drafts use their actual creation date and the visible label Written. No deployment or indexing submission occurred.

Across all ${articles.length} articles, the check found **${duplicates.length} repeated full body paragraphs** and **${issues.length} integrity issues**. The all-page browser report is [verification.json](verification.json); focused cohort checks are [${verificationName}.json](${verificationName}.json). See [research and evidence limits](${researchName}).

| Article | Reading words | Sections / FAQs | Tables | Contextual inbound articles | Distinct purpose |
|---|---:|---|---:|---:|---|
${rows.map(a=>`| [${a.title}](http://127.0.0.1:8770${a.route}) | ${a.readingWords} | ${a.sections} / ${a.faqs} | ${a.tables} | ${a.contextualInboundArticles.length} | ${a.intent} |`).join('\n')}

The articles cite ${report.newUniquePrimaryReferenceURLs} distinct primary-reference URLs beside relevant sections. Examples and planning figures are explicitly hypothetical. Query targets are editorial intent mappings rather than newly measured GSC demand. Provider facts are bounded source summaries; planning frameworks and examples are editorial analysis. SEO, AEO and GEO gains are not measured or guaranteed.
`);
console.log(JSON.stringify({newArticles:report.newArticles,totalArticles:report.totalArticles,totalPages:report.totalPages,readingWords:report.newReadingWords,sections:report.newSections,faqs:report.newFAQs,tables:report.newTables,primaryReferences:report.newUniquePrimaryReferenceURLs,inboundLinks:report.contextualInboundLinks,repeatedBodyParagraphs:duplicates.length,issues},null,2));
if(issues.length)process.exitCode=1;
