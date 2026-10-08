// Loaded only when a visitor opens resource search.
let initialized=false,index=[],pending;
const labels={guides:'Guide',compare:'Comparison',platforms:'Platform',blog:'Article'};
const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const starters=['how-to-become-a-clipper-india','creator-clipping-campaign-guide-india','best-clipping-platforms-india','how-much-do-clippers-make-india','creator-clipping-brief-template-india','instagram-reels-vs-youtube-shorts-clipping-india'];
export async function prepare(dialog){
 const input=dialog.querySelector('#quick-search-input'),category=dialog.querySelector('#quick-search-category'),results=dialog.querySelector('#quick-search-results'),status=dialog.querySelector('#quick-search-status'),all=dialog.querySelector('#quick-search-all'),retry=dialog.querySelector('.search-retry');
 function render(){
  if(!index.length)return;
  const q=normalize(input.value),terms=q.split(/\s+/).filter(Boolean),section=category.value;
  const matches=index.filter(item=>(section==='all'||item.section===section)&&terms.every(term=>item.search.includes(term)))
   .map(item=>({item,score:q?(item.titleSearch===q?100:0)+terms.reduce((n,t)=>n+(item.titleSearch.includes(t)?8:1),0):Math.max(0,20-starters.indexOf(item.slug))*(starters.includes(item.slug)?1:0)}))
   .sort((a,b)=>b.score-a.score);
  const fragment=document.createDocumentFragment();
  matches.slice(0,8).forEach(({item},i)=>{
   const link=document.createElement('a');link.href=item.path;
   const number=document.createElement('span');number.className='search-result-number';number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
   const copy=document.createElement('span');copy.className='search-result-copy';
   const meta=document.createElement('span');meta.className='search-result-meta';meta.textContent=labels[item.section]+' / '+item.minutes+' min read';
   const title=document.createElement('strong');title.textContent=item.title;
   const summary=document.createElement('span');summary.className='search-result-summary';summary.textContent=item.summary;
   copy.append(meta,title,summary);const arrow=document.createElement('span');arrow.className='search-result-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(number,copy,arrow);fragment.append(link);
  });
  results.replaceChildren(fragment);
  status.textContent=matches.length?(q||section!=='all'?`Showing ${Math.min(8,matches.length)} of ${matches.length} matching resources.`:'A few articles to start with. Search all '+index.length+' resources.'):'No articles found. Try a broader topic or another resource type.';
  const params=new URLSearchParams();if(input.value.trim())params.set('q',input.value.trim());if(section!=='all')params.set('category',section);
  all.href='/resources/'+(params.size?'?'+params.toString():'');all.textContent=q||section!=='all'?'Search the full library ↗':'Open the full library ↗';
 }
 if(!initialized){
  initialized=true;input.addEventListener('input',render);category.addEventListener('change',render);retry.addEventListener('click',()=>prepare(dialog));
  input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'&&results.firstElementChild){event.preventDefault();results.firstElementChild.focus();}});
  results.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp'].includes(event.key))return;const links=[...results.querySelectorAll('a')],i=links.indexOf(document.activeElement);if(i<0)return;event.preventDefault();if(event.key==='ArrowUp'&&i===0)input.focus();else links[Math.max(0,Math.min(links.length-1,i+(event.key==='ArrowDown'?1:-1)))].focus();});
 }
 if(!index.length){
  status.textContent='Loading the articles…';retry.hidden=true;
  try{
   pending ||= fetch('/search-index.json?v=studio-1').then(response=>{if(!response.ok)throw Error('Index unavailable');return response.json()}).then(data=>{
    if(!Array.isArray(data))throw Error('Invalid index');
    const entries=data.filter(item=>typeof item.title==='string'&&typeof item.summary==='string'&&labels[item.section]&&/^\/(guides|compare|platforms|blog)\/[a-z0-9-]+\.html$/.test(item.path));
    if(!entries.length)throw Error('Empty index');return entries.map(item=>({...item,slug:item.path.split('/').pop().replace(/\.html$/,''),titleSearch:normalize(item.title),search:normalize([item.title,item.summary,labels[item.section]].join(' '))}));
   });
   index=await pending;dialog.dataset.indexLoaded='true';
  }catch{pending=null;status.textContent='Search could not load. Retry or open the full resource library.';retry.hidden=false;return;}
 }
 render();
}
