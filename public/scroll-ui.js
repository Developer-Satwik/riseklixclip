(() => {
 'use strict';
 const story=document.querySelector('[data-story-navigation]'),dock=document.querySelector('[data-reading-dock]');
 if(!story&&!dock)return;
 const tocLinks=[...document.querySelectorAll('.toc nav a')],storyLinks=[...document.querySelectorAll('[data-story-navigation] ol a')];
 const jump=dock?.querySelector('[data-reading-jump]'),select=jump?.querySelector('select'),position=dock?.querySelector('[data-reading-position]'),progress=dock?.querySelector('[data-reading-progress]');
 const links=story?storyLinks:tocLinks;
 const targets=links.map(link=>({link,node:document.getElementById(link.hash.slice(1)),id:link.hash.slice(1)})).filter(item=>item.node);
 let bounds=[],start=0,end=1,frame=0,measureNeeded=true,lastId='',lastPercent=-1;
 if(jump){jump.hidden=false;position.hidden=false;dock.dataset.enhanced='true';}
 function measure(){
  const offset=Math.max((story||dock).getBoundingClientRect().height+24,parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+16;
  bounds=targets.map(item=>({...item,top:item.node.getBoundingClientRect().top+scrollY-offset})).sort((a,b)=>a.top-b.top);
  if(dock){const first=document.getElementById('direct-answer'),last=document.getElementById('sources');start=first.getBoundingClientRect().top+scrollY-offset;end=Math.max(start+1,last.getBoundingClientRect().bottom+scrollY-innerHeight+24);}
  measureNeeded=false;
 }
 function render(){
  frame=0;if(measureNeeded)measure();
  const current=bounds.filter(item=>item.top<=scrollY+1).at(-1)||bounds[0];
  if(current&&current.id!==lastId){
   links.forEach(link=>link.removeAttribute('aria-current'));current.link.setAttribute('aria-current','location');lastId=current.id;
   if(select&&!jump.contains(document.activeElement))select.value=current.id;
  }
  if(dock){const fraction=Math.max(0,Math.min(1,(scrollY-start)/(end-start))),percent=Math.round(fraction*100);if(percent!==lastPercent){position.textContent=percent+'%';progress.style.transform=`scaleX(${fraction})`;lastPercent=percent;}}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 function invalidate(){measureNeeded=true;schedule();}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',invalidate,{passive:true});window.addEventListener('pageshow',invalidate);
 if('ResizeObserver' in window){const observer=new ResizeObserver(invalidate);observer.observe(document.querySelector('#main'));}
 document.fonts?.ready.then(invalidate);invalidate();
 function focusTarget(id){
  const target=document.getElementById(id);if(!target)return;
  const focus=target.querySelector('h2,h3')||target;const previous=focus.getAttribute('tabindex');focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});
  focus.addEventListener('blur',()=>{if(previous===null)focus.removeAttribute('tabindex');else focus.setAttribute('tabindex',previous)},{once:true});
 }
 function navigate(id){if(location.hash==='#'+id)document.getElementById(id)?.scrollIntoView({block:'start'});else location.hash=id;focusTarget(id);schedule();}
 jump?.addEventListener('submit',event=>{event.preventDefault();navigate(select.value);});
 storyLinks.forEach(link=>link.addEventListener('click',event=>{if(event.button||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;event.preventDefault();navigate(link.hash.slice(1));}));
 document.querySelectorAll('[data-scroll-top]').forEach(link=>link.addEventListener('click',event=>{if(event.button||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;event.preventDefault();if(location.hash==='#top')window.scrollTo({top:0});else location.hash='top';const brand=document.querySelector('.site-header .brand');brand?.focus({preventScroll:true});}));
})();
