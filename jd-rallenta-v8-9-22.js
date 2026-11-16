/* JD V8.9.22 — 12 real hour positions. Cross 30° hour boundaries exactly, in either direction. */
(()=>{
 'use strict';
 function boot(){
  const section=document.querySelector('main#top > #rallenta.jd-rallenta22');
  const dial=section?.querySelector('.jr22-clock');
  const hand=dial?.querySelector('.jr22-hand');
  const live=section?.querySelector('[data-jr22-accessible]');
  if(!section||!dial||!hand)return;
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Clockwise: twelve o'clock at 0°, one o'clock at 30° ... eleven at 330°.
  const entries=[
   {hour:12,it:'Sospendi il giudizio.',en:'Suspend judgement.'},
   {hour:1,it:'Concediti il tempo.',en:'Give yourself time.'},
   {hour:2,it:'Osserva prima di comprendere.',en:'Observe before understanding.'},
   {hour:3,it:'Non tutto chiede una risposta.',en:'Not everything asks for an answer.'},
   {hour:4,it:'Guarda oltre ciò che vedi.',en:'Look beyond what you see.'},
   {hour:5,it:'Abita il presente.',en:'Inhabit the present.'},
   {hour:6,it:'Metti in dubbio l’ovvio.',en:'Question the obvious.'},
   {hour:7,it:'Scopri ciò che non cercavi.',en:'Discover what you were not seeking.'},
   {hour:8,it:'Ricomincia a guardare.',en:'Begin looking again.'},
   {hour:9,it:'Accogli il silenzio.',en:'Welcome the silence.'},
   {hour:10,it:'Lascia spazio al dubbio.',en:'Leave room for doubt.'},
   {hour:11,it:'Ogni sguardo è un inizio.',en:'Every gaze is a beginning.'}
  ];
  const nodes=new Map();
  for(const item of entries){
    const el=section.querySelector('[data-hour="'+item.hour+'"]');
    if(!el)return;
    el.style.setProperty('--hour-angle',((item.hour%12)*30)+'deg');
    nodes.set(item.hour,el);
  }
  const isEN=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false;}};
  const textFor=item=>isEN()?item.en:item.it;
  let activeHour=null,offTimer=0,angle=-12,prev=0,elapsed=0,raf=0;
  let dragging=false,lastPointer=0,lastInteraction=0,visible=true;
  function illuminate(hour){
    if(activeHour!==null){const previous=nodes.get(activeHour);previous?.classList.remove('is-lit');previous?.setAttribute('aria-hidden','true');}
    clearTimeout(offTimer);
    const item=entries.find(e=>e.hour===hour), node=nodes.get(hour);
    if(!item||!node)return;
    activeHour=hour;
    node.textContent=textFor(item);
    node.classList.add('is-lit');
    node.setAttribute('aria-hidden','false');
    if(live)live.textContent=textFor(item);
    offTimer=setTimeout(()=>{node.classList.remove('is-lit');node.setAttribute('aria-hidden','true')},3900);
  }
  function paint(){
    hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
    dial.setAttribute('aria-valuenow',String(Math.round(((angle%360)+360)%360)));
  }
  function crossing(previous,next){
    if(previous===next)return;
    // Clockwise at exactly 0,30... ; anticlockwise also at the actual crossing.
    // Unwrapped angles avoid errors at 360->0 and during multiple turns.
    const boundary=next>previous ? Math.floor(next/30)*30 : Math.ceil(next/30)*30;
    if(next>previous){if(boundary<=previous)return;}
    else if(boundary>=previous)return;
    const index=((Math.round(boundary/30)%12)+12)%12;
    illuminate(index===0?12:index);
  }
  function setAngle(next){const old=angle;angle=next;paint();crossing(old,next);}
  function loop(now){
    const dt=prev?Math.min((now-prev)/1000,.07):0;prev=now;
    if(!dragging&&now-lastInteraction>1700){elapsed+=dt;setAngle(angle+(4+96*Math.exp(-elapsed/2.9))*dt);}
    if(visible)raf=requestAnimationFrame(loop);
  }
  function pointerAngle(e){
    const r=dial.getBoundingClientRect();
    return Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI;
  }
  function release(){dragging=false;lastInteraction=performance.now();prev=performance.now();}
  dial.addEventListener('pointerdown',e=>{dragging=true;lastPointer=pointerAngle(e);lastInteraction=performance.now();dial.setPointerCapture(e.pointerId);e.preventDefault();});
  dial.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const next=pointerAngle(e);let delta=next-lastPointer;
    if(delta>180)delta-=360;if(delta< -180)delta+=360;
    lastPointer=next;lastInteraction=performance.now();setAngle(angle+delta);
  });
  dial.addEventListener('pointerup',release);dial.addEventListener('pointercancel',release);dial.addEventListener('lostpointercapture',release);
  dial.addEventListener('keydown',e=>{
    if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(e.key)){
      e.preventDefault();lastInteraction=performance.now();setAngle(angle+(['ArrowRight','ArrowUp'].includes(e.key)?15:-15));
    }
  });
  window.addEventListener('jd:languagechange',()=>{
    dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
    for(const item of entries){const el=nodes.get(item.hour);if(el.textContent)el.textContent=textFor(item);}
  });
  dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
  paint();
  if(!reduce){
    raf=requestAnimationFrame(loop);
    if('IntersectionObserver'in window){
      new IntersectionObserver(entries=>{
        visible=!!entries[0]?.isIntersecting;
        if(!visible&&raf){cancelAnimationFrame(raf);raf=0;prev=0;}
        if(visible&&!raf){prev=0;raf=requestAnimationFrame(loop);}
      },{threshold:.01}).observe(section);
    }
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
