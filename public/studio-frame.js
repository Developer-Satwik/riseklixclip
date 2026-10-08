export function setup(){
 const frameStage=document.querySelector('.frame-stage');
 if(frameStage){
  const formats=Array.from(document.querySelectorAll('[data-frame-format]')),focal=document.querySelector('#frame-focal'),guide=document.querySelector('#frame-guide-toggle');
  const lessons={landscape:['16:9','Keep the subject and setting clear.','A wide crop can show the subject and the setting together. Check that both are still clear on a smaller screen.'],portrait:['9:16','Keep the important part in view.','A tall crop brings the subject closer. Check what gets cut off and whether the action still makes sense.'],square:['1:1','Leave enough space for the message.','A square crop can keep the subject and nearby details together. Leave room for captions without covering the important part.']};
  function frame(format,announce=true){frameStage.dataset.frame=format;formats.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.frameFormat===format)));const [ratio,title,copy]=lessons[format];document.querySelector('[data-frame-ratio]').textContent=ratio;document.querySelector('[data-frame-title]').textContent=title;document.querySelector('[data-frame-copy]').textContent=copy;if(announce)document.querySelector('#frame-status').textContent=ratio+' '+format+' artwork frame selected.';}
  document.querySelector('.frame-controls').hidden=false;formats.forEach(button=>button.addEventListener('click',()=>frame(button.dataset.frameFormat)));
  focal.addEventListener('input',()=>frameStage.style.setProperty('--focal-point',focal.value+'%'));
  guide.addEventListener('click',()=>{const show=guide.getAttribute('aria-pressed')!=='true';guide.setAttribute('aria-pressed',String(show));guide.querySelector('span').textContent=show?'✓':'＋';frameStage.querySelector('.frame-guides').hidden=!show;});
  document.querySelector('#frame-reset').addEventListener('click',()=>{focal.value='72';frameStage.style.setProperty('--focal-point','72%');guide.setAttribute('aria-pressed','true');guide.querySelector('span').textContent='✓';frameStage.querySelector('.frame-guides').hidden=false;frame('landscape');});
 }
}
