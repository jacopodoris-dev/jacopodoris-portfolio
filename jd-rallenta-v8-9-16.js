/* jacopodoris V8.9.16 — inline Rallenta experience after existing header, before existing hero. */
(()=>{
  'use strict';
  function init(){
    const header=document.querySelector('header.site-nav');
    const main=document.querySelector('main#top');
    const opening=main?.querySelector('section#opening');
    if(!header||!main||!opening||document.querySelector('.jd-rallenta16'))return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style=document.createElement('style');
    style.id='jd-rallenta16-style';
    style.textContent=`
      .jd-rallenta16{--jr-ink:#282723;--jr-copper:#a8744f;position:relative;min-height:calc(100svh - 82px);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 52% 35%,#f7f5ef 0%,#efede6 62%,#e6e2d8 100%);color:var(--jr-ink);padding:clamp(48px,7vh,88px) 22px clamp(72px,10vh,115px);}
      .jd-rallenta16 *{box-sizing:border-box}
      .jd-rallenta16 .jr-kicker{position:absolute;top:clamp(18px,4vh,40px);left:var(--edge,5vw);font:10px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.19em;text-transform:uppercase;opacity:.52}
      .jd-rallenta16 .jr-center{display:flex;align-items:center;justify-content:center;flex-direction:column;width:100%;gap:clamp(17px,3vh,35px)}
      .jd-rallenta16 .jr-dial{--jr-size:min(47vh,68vw,460px);width:var(--jr-size);aspect-ratio:1;position:relative;border-radius:50%;touch-action:none;cursor:grab;background:radial-gradient(circle at 38% 26%,rgba(255,255,255,.84),rgba(248,247,243,.75) 21%,rgba(235,232,225,.57) 55%,rgba(196,191,181,.35) 89%,rgba(171,166,155,.31) 100%);border:1px solid rgba(171,166,158,.28);box-shadow:inset 8px 12px 32px rgba(255,255,255,.74),inset -14px -15px 35px rgba(90,84,77,.055),0 25px 48px rgba(47,40,35,.075);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);outline-offset:8px;}
      .jd-rallenta16 .jr-dial:focus-visible{outline:2px solid var(--jr-copper)}
      .jd-rallenta16 .jr-dial:active{cursor:grabbing}
      .jd-rallenta16 .jr-dial::before{content:'';position:absolute;inset:12%;border-radius:50%;border:1px solid rgba(74,71,64,.14);pointer-events:none}
      .jd-rallenta16 .jr-dial::after{content:'';position:absolute;inset:0;border-radius:50%;background:linear-gradient(120deg,transparent 14%,rgba(255,255,255,.30) 42%,transparent 68%);pointer-events:none}
      .jd-rallenta16 .jr-hand{position:absolute;left:50%;top:50%;width:2px;height:34%;background:linear-gradient(0deg,#9d6b4a,#bb8d6a);border-radius:2px;transform-origin:50% 100%;transform:translate(-50%,-100%) rotate(30deg);will-change:transform;pointer-events:none;box-shadow:0 0 6px rgba(168,116,79,.13)}
      .jd-rallenta16 .jr-pivot{position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:50%;background:#aa8164;transform:translate(-50%,-50%);pointer-events:none}
      .jd-rallenta16 .jr-dial-mark{position:absolute;left:0;right:0;top:59%;text-align:center;color:rgba(40,39,35,.36);font-size:9px;letter-spacing:.31em;pointer-events:none}
      .jd-rallenta16 .jr-word{margin:0;text-align:center;font-size:clamp(26px,4.1vw,50px);font-weight:300;letter-spacing:.21em;line-height:1.2;padding-left:.21em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
      .jd-rallenta16 .jr-subline{margin:0;text-align:center;font-size:clamp(13px,1.25vw,16px);font-weight:300;font-style:italic;letter-spacing:.075em;color:#77746e;line-height:1.6}
      .jd-rallenta16 .jr-help{margin:0;color:#7d7c75;font-size:11px;letter-spacing:.06em;text-align:center;line-height:1.5}
      .jd-rallenta16 .jr-continue{position:absolute;bottom:clamp(20px,4vh,38px);left:50%;transform:translateX(-50%);background:none;border:0;border-bottom:1px solid rgba(40,39,35,.35);padding:9px 3px;color:var(--jr-ink);font:11px 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
      .jd-rallenta16 .jr-continue:hover,.jd-rallenta16 .jr-continue:focus-visible{border-color:currentColor}
      .jd-rallenta16 .jr-word,.jd-rallenta16 .jr-subline{opacity:0;transform:translateY(8px);transition:opacity 1.3s ease,transform 1.3s ease}
      .jd-rallenta16.jr-ready .jr-word,.jd-rallenta16.jr-ready .jr-subline{opacity:1;transform:none}
      .jd-rallenta16.jr-ready .jr-subline{transition-delay:.65s}
      @media(max-width:800px){.jd-rallenta16{min-height:calc(100svh - 70px)}.jd-rallenta16 .jr-dial{--jr-size:min(67vw,43vh,370px)}.jd-rallenta16 .jr-word{font-size:clamp(25px,7vw,38px)}.jd-rallenta16 .jr-center{gap:20px}}
      @media(max-width:420px){.jd-rallenta16 .jr-kicker{font-size:9px}.jd-rallenta16 .jr-help{max-width:260px}}
      @media(prefers-reduced-motion:reduce){.jd-rallenta16 .jr-word,.jd-rallenta16 .jr-subline{opacity:1;transform:none;transition:none}}
    `;
    document.head.appendChild(style);
    const section=document.createElement('section');
    section.id='rallenta';
    section.className='jd-rallenta16';
    section.setAttribute('aria-label','Rallenta — tempo per riflettere');
    section.innerHTML=`<span class="jr-kicker">AN INVITATION TO PAUSE</span><div class="jr-center"><div class="jr-dial" role="slider" tabindex="0" aria-label="Manopola del tempo" aria-valuemin="0" aria-valuemax="359" aria-valuenow="30" aria-valuetext="Lancetta in movimento"><span class="jr-hand"></span><span class="jr-pivot"></span><span class="jr-dial-mark">JD / TIME</span></div><h2 class="jr-word">RALLENTA</h2><p class="jr-subline">Sospendi il giudizio...</p><p class="jr-help">Ruota la lancetta con il mouse o con un dito</p></div><button type="button" class="jr-continue">Scopri il portfolio</button>`;
    main.insertBefore(section,opening);
    const dial=section.querySelector('.jr-dial');
    const hand=section.querySelector('.jr-hand');
    const help=section.querySelector('.jr-help');
    const subline=section.querySelector('.jr-subline');
    const go=section.querySelector('.jr-continue');
    const isEN=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false}};
    const translate=()=>{
      subline.textContent=isEN()?'Suspend judgement...':'Sospendi il giudizio...';
      help.textContent=isEN()?'Turn the hand with your mouse or finger':'Ruota la lancetta con il mouse o con un dito';
      go.textContent=isEN()?'Explore the portfolio':'Scopri il portfolio';
      dial.setAttribute('aria-label',isEN()?'Time dial':'Manopola del tempo');
      section.setAttribute('aria-label',isEN()?'Slow down — time to reflect':'Rallenta — tempo per riflettere');
    };
    translate();window.addEventListener('jd:languagechange',translate);
    go.addEventListener('click',()=>opening.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'}));
    let angle=30,prev=0,elapsed=0,raf=0,active=false,lastInteraction=0,visible=true;
    function paint(){hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;dial.setAttribute('aria-valuenow',String(Math.round(((angle%360)+360)%360)));}
    function loop(now){
      const dt=prev?Math.min((now-prev)/1000,.07):0;prev=now;
      if(!active){
        if(now-lastInteraction>2200){elapsed+=dt;const velocity=6+104*Math.exp(-elapsed/3);angle+=velocity*dt;}
      }
      paint();if(visible)raf=requestAnimationFrame(loop);
    }
    if(!reduce)raf=requestAnimationFrame(loop);else paint();
    function pointerAngle(event){const r=dial.getBoundingClientRect();const x=event.clientX-(r.left+r.width/2),y=event.clientY-(r.top+r.height/2);return Math.atan2(x,-y)*180/Math.PI;}
    let previousPointer=null;
    dial.addEventListener('pointerdown',event=>{active=true;previousPointer=pointerAngle(event);lastInteraction=performance.now();dial.setPointerCapture(event.pointerId);event.preventDefault()});
    dial.addEventListener('pointermove',event=>{
      if(!active)return;
      const next=pointerAngle(event);let diff=next-previousPointer;
      if(diff>180)diff-=360;if(diff< -180)diff+=360;
      angle+=diff;previousPointer=next;lastInteraction=performance.now();paint();
    });
    const stop=()=>{if(!active)return;active=false;previousPointer=null;lastInteraction=performance.now();prev=performance.now()};
    dial.addEventListener('pointerup',stop);dial.addEventListener('pointercancel',stop);dial.addEventListener('lostpointercapture',stop);
    dial.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowUp'||event.key==='ArrowLeft'||event.key==='ArrowDown'){
        event.preventDefault();angle+=['ArrowRight','ArrowUp'].includes(event.key)?15:-15;lastInteraction=performance.now();paint();
      }
    });
    if('IntersectionObserver' in window&&!reduce){
      const io=new IntersectionObserver(entries=>{
        visible=!!entries[0]?.isIntersecting;
        if(!visible&&raf){cancelAnimationFrame(raf);raf=0;prev=0}
        if(visible&&!raf){prev=0;raf=requestAnimationFrame(loop)}
      },{threshold:.01});io.observe(section);
    }
    requestAnimationFrame(()=>section.classList.add('jr-ready'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
