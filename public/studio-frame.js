export function setup(){
 const frameStage=document.querySelector('.frame-stage');
 if(frameStage){
  const formats=Array.from(document.querySelectorAll('[data-frame-format]')),focal=document.querySelector('#frame-focal'),guide=document.querySelector('#frame-guide-toggle');
  const lessons={landscape:['16:9','Let the setting tell part of the story.','A landscape frame can keep the subject and surroundings together. Check that the meaning still survives when the canvas gets smaller.'],portrait:['9:16','Give the subject a clear centre of gravity.','A portrait crop brings the subject closer. Keep the action readable, and check which context is lost at the edges.'],square:['1:1','Balance the subject with the surrounding space.','A square crop can bring different elements into a tighter conversation. Keep enough room for the message without covering the subject.']};
  function frame(format,announce=true){frameStage.dataset.frame=format;formats.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.frameFormat===format)));const [ratio,title,copy]=lessons[format];document.querySelector('[data-frame-ratio]').textContent=ratio;document.querySelector('[data-frame-title]').textContent=title;document.querySelector('[data-frame-copy]').textContent=copy;if(announce)document.querySelector('#frame-status').textContent=ratio+' '+format+' artwork frame selected.';}
  document.querySelector('.frame-controls').hidden=false;formats.forEach(button=>button.addEventListener('click',()=>frame(button.dataset.frameFormat)));
  focal.addEventListener('input',()=>frameStage.style.setProperty('--focal-point',focal.value+'%'));
  guide.addEventListener('click',()=>{const show=guide.getAttribute('aria-pressed')!=='true';guide.setAttribute('aria-pressed',String(show));guide.querySelector('span').textContent=show?'✓':'＋';frameStage.querySelector('.frame-guides').hidden=!show;});
  document.querySelector('#frame-reset').addEventListener('click',()=>{focal.value='72';frameStage.style.setProperty('--focal-point','72%');guide.setAttribute('aria-pressed','true');guide.querySelector('span').textContent='✓';frameStage.querySelector('.frame-guides').hidden=false;frame('landscape');});
 }
}
