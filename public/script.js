(() => {
 'use strict';
 const root=document.documentElement;
 const theme=document.querySelector('.theme-select');
 if(theme){theme.value=['system','light','dark'].includes(root.dataset.theme)?root.dataset.theme:'system';theme.addEventListener('change',()=>{root.dataset.theme=theme.value;try{localStorage.setItem('rk-theme',theme.value)}catch{}});}
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
 const closeMenu=()=>{if(!menu||!nav)return;menu.setAttribute('aria-expanded','false');nav.classList.remove('open');};
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
 nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
 window.matchMedia('(min-width: 1101px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
 // Keep the guide as a normal link; open the community during the same user gesture.
 document.querySelectorAll('[data-discord-invite]').forEach(link=>{
  link.addEventListener('click',event=>{
   if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   try{window.open(link.dataset.discordInvite,'_blank','noopener,noreferrer')}catch{} // The guide still opens; its direct invite link is the fallback.
  });
 });
 const search=document.querySelector('#resource-search'),category=document.querySelector('#resource-category');
 const cards=Array.from(document.querySelectorAll('#resource-grid .resource-card'));
 const searchText=new Map(cards.map(card=>[card,card.dataset.search.normalize('NFKD').replace(/[\u0300-\u036f]/g,'')]));
 const savedKey='rk-reading-list',viewKey='rk-library-view';
 let saved=new Set(),savedOnly=false,storageAvailable=true;
 function parseSaved(value){try{const data=JSON.parse(value||'[]');return new Set(Array.isArray(data)?data.filter(id=>typeof id==='string'&&/^[a-z0-9-]{1,120}$/.test(id)):[])}catch{return new Set()}}
 try{saved=parseSaved(localStorage.getItem(savedKey))}catch{storageAvailable=false}
 const saveButtons=Array.from(document.querySelectorAll('[data-save-resource]'));
 const savedFilter=document.querySelector('#saved-filter');
 function updateSaved(){
  saveButtons.forEach(button=>{const active=saved.has(button.dataset.saveResource);button.setAttribute('aria-pressed',String(active));const title=button.getAttribute('aria-label').replace(/^(Save|Remove saved): /,'');button.setAttribute('aria-label',(active?'Remove saved: ':'Save: ')+title);button.querySelector('[data-save-label]').textContent=active?'Saved':'Save';button.querySelector('[aria-hidden]').textContent=active?'✓':'＋';button.hidden=false;});
  const count=document.querySelector('#saved-count');if(count)count.textContent=String(cards.filter(card=>saved.has(card.dataset.slug)).length);
 }
 saveButtons.forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.saveResource;if(saved.has(id))saved.delete(id);else saved.add(id);
  try{localStorage.setItem(savedKey,JSON.stringify([...saved]))}catch{storageAvailable=false}
  updateSaved();filter();if(savedOnly&&!saved.has(id))savedFilter?.focus();
  const status=document.querySelector('#reader-status')||document.querySelector('#library-status');
  if(status)status.textContent=saved.has(id)?(storageAvailable?'Saved in this browser.':'Saved for this visit. Your browser could not keep it for later.'):'Removed from your reading list.';
 }));
 updateSaved();
 const libraryNote=document.querySelector('.library-note');if(libraryNote&&!storageAvailable)libraryNote.textContent='You can save articles for this visit. Your browser could not keep them for later.';
 window.addEventListener('storage',event=>{if(event.key===savedKey){saved=parseSaved(event.newValue);updateSaved();filter();}});
 const grid=document.querySelector('#resource-grid'),viewButtons=Array.from(document.querySelectorAll('[data-library-view]'));
 function setView(view){if(!grid)return;grid.dataset.view=view;viewButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.libraryView===view)));}
 if(grid){let preferred='grid';try{if(localStorage.getItem(viewKey)==='list')preferred='list'}catch{}setView(preferred);document.querySelector('.library-tools').hidden=false;}
 viewButtons.forEach(button=>button.addEventListener('click',()=>{setView(button.dataset.libraryView);try{localStorage.setItem(viewKey,button.dataset.libraryView)}catch{}}));
 savedFilter?.addEventListener('click',()=>{savedOnly=!savedOnly;savedFilter.setAttribute('aria-pressed',String(savedOnly));filter();});

 function filter(){const q=search?.value.trim().toLowerCase()||'',terms=q.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(Boolean),c=category?.value||'all';let count=0;cards.forEach(card=>{const visible=terms.every(term=>searchText.get(card).includes(term))&&(c==='all'||c===card.dataset.category)&&(!savedOnly||saved.has(card.dataset.slug));if(card.hidden===visible)card.hidden=!visible;if(visible)count++;});const result=document.querySelector('.result-count');if(result)result.textContent=`${count} resource${count===1?'':'s'}`;const empty=document.querySelector('.empty-state');if(empty){empty.hidden=count!==0;empty.querySelector('h2').textContent=savedOnly?'No saved articles match':'No matching resources';empty.querySelector('p').textContent=savedOnly?'Save an article or clear the filters to browse the library.':'Try a broader topic or clear the filters.';}}
 search?.addEventListener('input',filter);category?.addEventListener('change',filter);
 document.querySelector('#clear-filters')?.addEventListener('click',()=>{if(search)search.value='';if(category)category.value='all';savedOnly=false;savedFilter?.setAttribute('aria-pressed','false');filter();search?.focus();});
 const reader=document.querySelector('.reader-tools');if(reader){reader.hidden=false;if(!storageAvailable)document.querySelector('#reader-status').textContent='You can save this article for this visit. Your browser could not keep it for later.';}
 document.querySelector('[data-copy-link]')?.addEventListener('click',async()=>{
  const status=document.querySelector('#reader-status');try{await navigator.clipboard.writeText(location.href);status.textContent='Page link copied.'}catch{status.textContent='Copy the page address from your browser; clipboard access is unavailable.'}
 });
 const choices=Array.from(document.querySelectorAll('[data-cut-select]')),panels=Array.from(document.querySelectorAll('[data-cut-panel]'));
 function chooseCut(id,announce=false){
  choices.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cutSelect===id)));
  panels.forEach(panel=>{panel.hidden=panel.dataset.cutPanel!==id;});
  if(announce)document.querySelector('#cut-status').textContent=`Showing the ${choices.find(button=>button.dataset.cutSelect===id).textContent.trim().slice(2)} fictional editing example.`;
 }
 if(choices.length){chooseCut(choices[0].dataset.cutSelect);document.querySelector('.cut-switcher').hidden=false;choices.forEach(button=>button.addEventListener('click',()=>chooseCut(button.dataset.cutSelect,true)));}
 const tocMenu=document.querySelector('.toc-menu');if(tocMenu){const compact=window.matchMedia('(max-width:820px)');tocMenu.open=!compact.matches;compact.addEventListener('change',e=>{tocMenu.open=!e.matches});}
 const studio=document.querySelector('.framing-studio');
 if(studio){const loadStudio=()=>import('/studio-frame.js?v=wording-1').then(module=>module.setup()).catch(()=>{});if('IntersectionObserver' in window){const previewObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){previewObserver.disconnect();loadStudio();}},{rootMargin:'200px'});previewObserver.observe(studio);}else loadStudio();}
 const searchDialog=document.querySelector('#quick-search'),searchTriggers=document.querySelectorAll('[data-open-search]');
 if(searchDialog&&typeof searchDialog.showModal==='function'){
  let modulePromise,opener;
  async function openSearch(){if(searchDialog.open)return;opener=document.activeElement;searchDialog.showModal();searchDialog.querySelector('input').focus();try{modulePromise ||= import('/quick-search.js?v=wording-1');await (await modulePromise).prepare(searchDialog);}catch{modulePromise=null;searchDialog.querySelector('#quick-search-status').textContent='Search could not load. Close and reopen it, or use the full library link.';}}
  searchTriggers.forEach(button=>{button.hidden=false;button.addEventListener('click',openSearch)});
  searchDialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus()});
  searchDialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();searchDialog.close();}if(event.key==='Tab'){const stops=Array.from(searchDialog.querySelectorAll('button,input,select,a[href]')).filter(el=>!el.disabled&&el.getClientRects().length);const first=stops[0],last=stops.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&!event.altKey&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}});
 }
 if(search){const params=new URLSearchParams(location.search);search.value=(params.get('q')||'').slice(0,120);const wanted=params.get('category');if(category&&Array.from(category.options).some(option=>option.value===wanted))category.value=wanted;if(search.value||wanted)filter();}
 const enquiry=document.querySelector('#campaign-enquiry');if(enquiry)import('/campaign-enquiry.js?v=wording-1').then(module=>module.setup(enquiry)).catch(()=>{});
 const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
 const number=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(n);
 function result(output,items){output.replaceChildren();const grid=document.createElement('div');grid.className='result-grid';for(const [label,value] of items){const cell=document.createElement('div'),caption=document.createElement('span'),valueNode=document.createElement('strong');caption.textContent=label;valueNode.textContent=value;cell.append(caption,valueNode);grid.append(cell);}output.append(grid);}
 const roi=document.querySelector('#roi-form');
 roi?.addEventListener('submit',e=>{e.preventDefault();if(!roi.reportValidity())return;const f=new FormData(roi),cost=Number(f.get('cost')),views=Number(f.get('views')),revenue=Number(f.get('revenue'));if(![cost,views,revenue].every(Number.isFinite)||cost<=0||views<0||revenue<0)return;result(document.querySelector('#roi-output'),[['Estimated ROI',number((revenue-cost)/cost*100)+'%'],['Cost per 1,000 views',views===0?'Undefined (zero views)':money(cost/views*1000)],['Attributable revenue less cost',money(revenue-cost)],['Scenario status','Your assumptions']]);});
 roi?.addEventListener('reset',()=>{document.querySelector('#roi-output').textContent='Add your figures to see ROI and cost per 1,000 views.';});
 const earnings=document.querySelector('#earnings-form');
 earnings?.addEventListener('submit',e=>{e.preventDefault();if(!earnings.reportValidity())return;const f=new FormData(earnings),views=Number(f.get('views')),rate=Number(f.get('rate')),fee=Number(f.get('fee')),cap=f.get('cap')===''?Infinity:Number(f.get('cap'));if(![views,rate,fee].every(Number.isFinite)||views<0||rate<0||fee<0||fee>100||cap<0||Number.isNaN(cap))return;const gross=Math.min(views/1000*rate,cap);result(document.querySelector('#earnings-output'),[['Estimated payment before fees',money(gross)],['Estimated payment after fees',money(gross*(1-fee/100))],['Fee amount',money(gross*fee/100)],['Status','Estimate; payment not confirmed']]);});
 earnings?.addEventListener('reset',()=>{document.querySelector('#earnings-output').textContent='Enter the agreed terms to see an estimate before and after fees.';});
 document.querySelectorAll('.brief-form').forEach(form=>{
  const fields=Array.from(form.querySelectorAll('[name]')),output=form.querySelector('.brief-output'),status=form.querySelector('.form-status'),key=form.dataset.draftKey;
  function compose(){return (key.includes('talent')?'CLIP BY RISEKLIX — TALENT INTRODUCTION':'CLIP BY RISEKLIX — CAMPAIGN BRIEF')+'\n\n'+fields.map(input=>`${input.closest('label').querySelector('span').textContent}:\n${input.value.trim()||'[To confirm]'}`).join('\n\n')+'\n\nDraft for discussion. Confirm rights, scope, review and payment terms before work begins.';}
  function save(){try{localStorage.setItem(key,JSON.stringify(Object.fromEntries(fields.map(x=>[x.name,x.value]))));status.textContent='Draft saved in this browser. Nothing has been sent.';}catch{status.textContent='Browser storage is unavailable. You can still copy or download your draft.';}output.value=compose();}
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){fields.forEach(x=>{if(typeof saved[x.name]==='string')x.value=saved[x.name]});output.value=compose();status.textContent='Your saved draft is ready to continue.';}}catch{}
  form.addEventListener('input',save);
  form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity()){save();status.textContent='Draft ready to review. Copy or download it, then share it with the team.';output.focus();}});
  form.querySelector('[data-copy-brief]')?.addEventListener('click',async()=>{if(!form.reportValidity())return;output.value=compose();try{await navigator.clipboard.writeText(output.value);status.textContent='Draft copied. Nothing has been sent.';}catch{output.focus();output.select();status.textContent='Select and copy the draft above; clipboard access is unavailable.';}});
  form.querySelector('[data-download-brief]')?.addEventListener('click',()=>{if(!form.reportValidity())return;output.value=compose();const url=URL.createObjectURL(new Blob([output.value],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=key.includes('talent')?'riseklix-talent-introduction.txt':'riseklix-campaign-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Draft downloaded. Nothing has been sent.';});
  form.addEventListener('reset',()=>{try{localStorage.removeItem(key)}catch{}output.value='';status.textContent='Draft cleared from this browser.';});
 });
})();
