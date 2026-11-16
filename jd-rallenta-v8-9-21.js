/* Jacopo Doris V8.9.21 — minimal clock, alternating phrases, synchronized with hand crossings. */
(()=>{
 'use strict';
 const start=()=>{
  const section=document.querySelector('main#top > section#rallenta.jd-rallenta21');
  const dial=section?.querySelector('.jr18-dial');
  const hand=dial?.querySelector('.jr18-hand');
  const left=section?.querySelector('[data-jr21-left]');
  const right=section?.querySelector('[data-jr21-right]');
  const accessible=section?.querySelector('[data-jr21-accessible]');
  if(!dial||!hand||!left||!right)return;
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const phrasePairs=[
   ['Sospendi il giudizio.','Suspend judgement.'],
   ['Concediti il tempo.','Give yourself time.'],
   ['Osserva prima di comprendere.','Observe before understanding.'],
   ['Non tutto chiede una risposta.','Not everything asks for an answer.'],
   ['Guarda oltre ciò che vedi.','Look beyond what you see.'],
   ['Abita il presente.','Inhabit the present.'],
   ['Metti in dubbio l’ovvio.','Question the obvious.'],
   ['Scopri ciò che non cercavi.','Discover what you were not seeking.'],
   ['Ricomincia a guardare.','Begin looking again.']
  ];
  const isEN=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false}};
  let angle=26,prev=0,elapsed=0,raf=0,active=false,lastInteraction=0,visible=true,lastPointer=null;
  let phraseIndex=-1,hasStarted=false,hideTimer=0,sequenceStartAngle=0,nextTriggerAngle=0;
  const firstPhraseDelay=7500;
  const waitUntil=performance.now()+firstPhraseDelay;
  const useMobile=()=>window.matchMedia('(max-width:800px)').matches;
  const phraseText=i=>phrasePairs[i][isEN()?1:0];
  function showPhrase(i){
    clearTimeout(hideTimer);
    phraseIndex=i;
    const side=useMobile()?right:((i%2===0)?left:right);
    const other=side===left?right:left;
    other.classList.remove('jr21-lit');
    other.setAttribute('aria-hidden','true');
    side.textContent=phraseText(i);
    side.setAttribute('aria-hidden','false');
    // Restart the fade-in even when consecutive phrases use the same mobile slot.
    side.classList.remove('jr21-lit');
    void side.offsetWidth;
    side.classList.add('jr21-lit');
    accessible.textContent=phraseText(i);
    hideTimer=window.setTimeout(()=>{side.classList.remove('jr21-lit');side.setAttribute('aria-hidden','true')},5600);
  }
  function paint(){
    hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
    dial.setAttribute('aria-valuenow',String(Math.round(((angle%360)+360)%360)));
  }
  function checkPhrase(now){
    if(!hasStarted){
      if(now<waitUntil)return;
      hasStarted=true;
      sequenceStartAngle=angle;
      nextTriggerAngle=sequenceStartAngle+9;
    }
    if(angle>=nextTriggerAngle){
      showPhrase((phraseIndex+1)%phrasePairs.length);
      // One event at a time even if the hand is dragged rapidly across positions.
      nextTriggerAngle=angle+36;
    }
    // If rotated backwards, place the next activation in the current direction again.
    if(angle<nextTriggerAngle-100)nextTriggerAngle=angle+36;
  }
  function loop(now){
    const dt=prev?Math.min((now-prev)/1000,.07):0;
    prev=now;
    if(!active&&now-lastInteraction>1800){
      elapsed+=dt;
      angle+=(4+96*Math.exp(-elapsed/2.9))*dt;
    }
    paint();
    checkPhrase(now);
    if(visible)raf=requestAnimationFrame(loop);
  }
  function pointerAngle(e){
    const r=dial.getBoundingClientRect();
    return Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI;
  }
  function release(){
    active=false;lastPointer=null;lastInteraction=performance.now();prev=performance.now();
  }
  dial.addEventListener('pointerdown',e=>{
    active=true;lastPointer=pointerAngle(e);lastInteraction=performance.now();
    dial.setPointerCapture(e.pointerId);e.preventDefault();
  });
  dial.addEventListener('pointermove',e=>{
    if(!active)return;
    const next=pointerAngle(e);let diff=next-lastPointer;
    if(diff>180)diff-=360;if(diff< -180)diff+=360;
    angle+=diff;lastPointer=next;lastInteraction=performance.now();paint();
    checkPhrase(performance.now());
  });
  dial.addEventListener('pointerup',release);
  dial.addEventListener('pointercancel',release);
  dial.addEventListener('lostpointercapture',release);
  dial.addEventListener('keydown',e=>{
    if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(e.key)){
      e.preventDefault();angle+=['ArrowRight','ArrowUp'].includes(e.key)?15:-15;
      lastInteraction=performance.now();paint();checkPhrase(performance.now());
    }
  });
  window.addEventListener('jd:languagechange',()=>{
    dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
    if(phraseIndex>=0){
      const side=useMobile()?right:(phraseIndex%2===0?left:right);
      side.textContent=phraseText(phraseIndex);
      accessible.textContent=phraseText(phraseIndex);
    }
  });
  dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
  if(!reduce){
    raf=requestAnimationFrame(loop);
    if('IntersectionObserver'in window){
      const io=new IntersectionObserver(entries=>{
        visible=!!entries[0]?.isIntersecting;
        if(!visible&&raf){cancelAnimationFrame(raf);raf=0;prev=0}
        if(visible&&!raf){prev=0;raf=requestAnimationFrame(loop)}
      },{threshold:.01});
      io.observe(section);
    }
  }else paint();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
