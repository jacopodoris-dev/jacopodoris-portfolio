/* Jacopo Doris V8.9.18 — only the dial behavior; layout & text are native HTML/CSS. */
(()=>{
  'use strict';
  const start=()=>{
    const section=document.querySelector('main#top > section#rallenta.jd-rallenta18');
    const dial=section?.querySelector('.jr18-dial');
    const hand=dial?.querySelector('.jr18-hand');
    const subline=section?.querySelector('[data-jr18-subline]');
    if(!dial || !hand || !subline) return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isEN=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false;}};
    const translate=()=>{
      subline.textContent=isEN()?'Suspend judgement...':'Sospendi il giudizio...';
      dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
    };
    translate();
    window.addEventListener('jd:languagechange',translate);

    let angle=26,prev=0,elapsed=0,raf=0,active=false,lastInteraction=0,visible=true,lastPointer=null;
    const paint=()=>{
      hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
      dial.setAttribute('aria-valuenow',String(Math.round(((angle%360)+360)%360)));
    };
    const loop=now=>{
      const dt=prev?Math.min((now-prev)/1000,.07):0;
      prev=now;
      if(!active && now-lastInteraction>1800){
        elapsed+=dt;
        angle+=(4+96*Math.exp(-elapsed/2.9))*dt;
      }
      paint();
      if(visible)raf=requestAnimationFrame(loop);
    };
    const pointerAngle=event=>{
      const r=dial.getBoundingClientRect();
      return Math.atan2(event.clientX-r.left-r.width/2,-(event.clientY-r.top-r.height/2))*180/Math.PI;
    };
    const release=()=>{active=false;lastPointer=null;lastInteraction=performance.now();prev=performance.now();};
    dial.addEventListener('pointerdown',event=>{
      active=true;lastPointer=pointerAngle(event);lastInteraction=performance.now();
      dial.setPointerCapture(event.pointerId);event.preventDefault();
    });
    dial.addEventListener('pointermove',event=>{
      if(!active)return;
      const next=pointerAngle(event);
      let diff=next-lastPointer;
      if(diff>180)diff-=360;
      if(diff<-180)diff+=360;
      angle+=diff;lastPointer=next;lastInteraction=performance.now();paint();
    });
    dial.addEventListener('pointerup',release);
    dial.addEventListener('pointercancel',release);
    dial.addEventListener('lostpointercapture',release);
    dial.addEventListener('keydown',event=>{
      if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(event.key)){
        event.preventDefault();angle+=['ArrowRight','ArrowUp'].includes(event.key)?15:-15;
        lastInteraction=performance.now();paint();
      }
    });
    if(!reduce){
      raf=requestAnimationFrame(loop);
      if('IntersectionObserver'in window){
        const observer=new IntersectionObserver(entries=>{
          visible=!!entries[0]?.isIntersecting;
          if(!visible && raf){cancelAnimationFrame(raf);raf=0;prev=0;}
          if(visible && !raf){prev=0;raf=requestAnimationFrame(loop);}
        },{threshold:0.01});
        observer.observe(section);
      }
    } else paint();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
