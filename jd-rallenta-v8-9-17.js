/* jacopodoris V8.9.17 — Rallenta inserted before the opening image, no flash, no helper text. */
(()=>{
  'use strict';

  function init(){
    const body=document.body;
    const main=document.querySelector('main#top');
    const opening=main?.querySelector('section#opening');
    if(!body || !main || !opening || document.getElementById('rallenta')) return;

    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style=document.createElement('style');
    style.id='jd-rallenta17-style';
    style.textContent=`
      .jd-rallenta17{
        --jr-ink:#272621;
        --jr-soft:#6d6a64;
        --jr-ring:rgba(39,38,33,.10);
        --jr-copper:#a97754;
        position:relative;
        min-height:calc(100svh - 78px);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:clamp(40px,5vh,70px) 22px;
        overflow:hidden;
        isolation:isolate;
        color:var(--jr-ink);
        background:radial-gradient(circle at 50% 38%, rgba(255,255,255,.34), rgba(255,255,255,0) 28%), linear-gradient(180deg,#efede7 0%,#e9e5dc 100%);
      }
      .jd-rallenta17 *{box-sizing:border-box}
      .jd-rallenta17 .jr-wrap{
        width:min(100%,720px);
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        gap:clamp(18px,2.4vh,32px);
      }
      .jd-rallenta17 .jr-dial{
        --jr-size:min(44vh,64vw,400px);
        width:var(--jr-size);
        aspect-ratio:1;
        position:relative;
        border-radius:50%;
        touch-action:none;
        cursor:grab;
        opacity:0;
        transform:scale(.975);
        transition:opacity 1s ease, transform 1.1s ease;
        background:radial-gradient(circle at 50% 48%, rgba(255,255,255,.18), rgba(255,255,255,.02) 56%, rgba(255,255,255,0) 100%);
      }
      .jd-rallenta17.jr-ready .jr-dial{opacity:1;transform:none}
      .jd-rallenta17 .jr-dial:active{cursor:grabbing}
      .jd-rallenta17 .jr-dial:focus-visible{outline:1px solid rgba(39,38,33,.28);outline-offset:8px}
      .jd-rallenta17 .jr-ring,
      .jd-rallenta17 .jr-ring-2,
      .jd-rallenta17 .jr-ring-3{
        position:absolute;
        border-radius:50%;
        inset:0;
        border:1px solid var(--jr-ring);
        pointer-events:none;
      }
      .jd-rallenta17 .jr-ring-2{inset:11%}
      .jd-rallenta17 .jr-ring-3{inset:24%;opacity:.55}
      .jd-rallenta17 .jr-hand{
        position:absolute;
        left:50%; top:50%;
        width:1.5px; height:35%;
        transform-origin:50% 100%;
        transform:translate(-50%,-100%) rotate(26deg);
        background:linear-gradient(180deg,var(--jr-copper),rgba(169,119,84,.84));
        border-radius:2px;
        pointer-events:none;
        will-change:transform;
        box-shadow:0 0 6px rgba(169,119,84,.12);
      }
      .jd-rallenta17 .jr-pivot{
        position:absolute; left:50%; top:50%;
        width:6px; height:6px; border-radius:50%;
        transform:translate(-50%,-50%);
        background:rgba(169,119,84,.92);
        pointer-events:none;
      }
      .jd-rallenta17 .jr-word,
      .jd-rallenta17 .jr-subline{
        margin:0;
        text-align:center;
        opacity:0;
        transform:translateY(10px);
      }
      .jd-rallenta17 .jr-word{
        font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
        font-size:clamp(28px,4vw,52px);
        font-weight:300;
        letter-spacing:.22em;
        line-height:1.08;
        padding-left:.22em;
        transition:opacity 1.1s ease, transform 1.1s ease;
      }
      .jd-rallenta17 .jr-subline{
        font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
        font-size:clamp(13px,1.18vw,16px);
        font-weight:300;
        font-style:italic;
        letter-spacing:.075em;
        line-height:1.6;
        color:var(--jr-soft);
        transition:opacity 1.1s ease .62s, transform 1.1s ease .62s;
      }
      .jd-rallenta17.jr-ready .jr-word,
      .jd-rallenta17.jr-ready .jr-subline{opacity:1;transform:none}
      @media(max-width:800px){
        .jd-rallenta17{min-height:calc(100svh - 70px)}
        .jd-rallenta17 .jr-dial{--jr-size:min(66vw,36vh,330px)}
        .jd-rallenta17 .jr-word{font-size:clamp(26px,8.4vw,38px)}
      }
      @media(prefers-reduced-motion:reduce){
        .jd-rallenta17 .jr-dial,
        .jd-rallenta17 .jr-word,
        .jd-rallenta17 .jr-subline{opacity:1;transform:none;transition:none}
      }
    `;
    document.head.appendChild(style);

    const section=document.createElement('section');
    section.id='rallenta';
    section.className='jd-rallenta17';
    section.setAttribute('aria-label','Rallenta');
    section.innerHTML=`
      <div class="jr-wrap">
        <div class="jr-dial" role="slider" tabindex="0" aria-label="Manopola del tempo" aria-valuemin="0" aria-valuemax="359" aria-valuenow="26">
          <span class="jr-ring"></span>
          <span class="jr-ring-2"></span>
          <span class="jr-ring-3"></span>
          <span class="jr-hand"></span>
          <span class="jr-pivot"></span>
        </div>
        <h2 class="jr-word">RALLENTA</h2>
        <p class="jr-subline">Sospendi il giudizio...</p>
      </div>`;

    main.insertBefore(section, opening);

    const dial=section.querySelector('.jr-dial');
    const hand=section.querySelector('.jr-hand');
    const word=section.querySelector('.jr-word');
    const subline=section.querySelector('.jr-subline');

    const isEN=()=>{try{return localStorage.getItem('jd-language')==='en';}catch{return false;}};
    const translate=()=>{
      word.textContent='RALLENTA';
      subline.textContent=isEN() ? 'Suspend judgement...' : 'Sospendi il giudizio...';
      dial.setAttribute('aria-label', isEN() ? 'Time dial' : 'Manopola del tempo');
    };
    translate();
    window.addEventListener('jd:languagechange',translate);

    let angle=26;
    let prev=0;
    let elapsed=0;
    let raf=0;
    let active=false;
    let lastInteraction=0;
    let visible=true;
    let previousPointer=null;

    const paint=()=>{
      hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
      dial.setAttribute('aria-valuenow', String(Math.round(((angle%360)+360)%360)));
    };

    function loop(now){
      const dt=prev ? Math.min((now-prev)/1000,.07) : 0;
      prev=now;
      if(!active){
        if(now-lastInteraction>1800){
          elapsed += dt;
          const velocity = 4 + 96*Math.exp(-elapsed/2.9);
          angle += velocity*dt;
        }
      }
      paint();
      if(visible) raf=requestAnimationFrame(loop);
    }

    const pointerAngle=(event)=>{
      const r=dial.getBoundingClientRect();
      const x=event.clientX-(r.left+r.width/2);
      const y=event.clientY-(r.top+r.height/2);
      return Math.atan2(x,-y)*180/Math.PI;
    };

    const stopInteraction=()=>{
      if(!active) return;
      active=false;
      previousPointer=null;
      lastInteraction=performance.now();
      prev=performance.now();
    };

    dial.addEventListener('pointerdown',event=>{
      active=true;
      previousPointer=pointerAngle(event);
      lastInteraction=performance.now();
      dial.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    dial.addEventListener('pointermove',event=>{
      if(!active) return;
      const next=pointerAngle(event);
      let diff=next-previousPointer;
      if(diff>180) diff-=360;
      if(diff<-180) diff+=360;
      angle += diff;
      previousPointer=next;
      lastInteraction=performance.now();
      paint();
    });
    dial.addEventListener('pointerup',stopInteraction);
    dial.addEventListener('pointercancel',stopInteraction);
    dial.addEventListener('lostpointercapture',stopInteraction);
    dial.addEventListener('keydown',event=>{
      if(['ArrowRight','ArrowUp','ArrowLeft','ArrowDown'].includes(event.key)){
        event.preventDefault();
        angle += (event.key==='ArrowRight'||event.key==='ArrowUp') ? 15 : -15;
        lastInteraction=performance.now();
        paint();
      }
    });

    if(!reduce){
      raf=requestAnimationFrame(loop);
      if('IntersectionObserver' in window){
        const io=new IntersectionObserver(entries=>{
          visible=!!entries[0]?.isIntersecting;
          if(!visible && raf){cancelAnimationFrame(raf); raf=0; prev=0;}
          if(visible && !raf){prev=0; raf=requestAnimationFrame(loop);}
        },{threshold:.01});
        io.observe(section);
      }
    } else {
      paint();
    }

    requestAnimationFrame(()=>section.classList.add('jr-ready'));
    body.classList.add('jd-rallenta17-mounted','jd-rallenta17-ready');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
