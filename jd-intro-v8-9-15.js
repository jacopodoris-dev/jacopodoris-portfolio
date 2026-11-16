/* Jacopo Doris V8.9.15 — integrate the user's Rallenta intro v1.1 before the existing portfolio. */
(()=>{
  'use strict';
  const init=()=>{
    // Direct links to a project or the shop should not be interrupted.
    if(location.hash && location.hash !== '#top') return;
    const header=document.querySelector('header.site-nav');
    if(!header || document.querySelector('.jd-intro15')) return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const styles=document.createElement('style');
    styles.id='jd-intro15-css';
    styles.textContent=`
      .jd-intro15 { --jd15-ink:#282723; position:relative; min-height:100svh; display:flex; flex-direction:column; align-items:center; justify-content:center; isolation:isolate; overflow:hidden; color:var(--jd15-ink); background:radial-gradient(ellipse at 52% 36%,#f4f1e9 0%,#e9e5dc 63%,#dfdacf 100%); }
      .jd-intro15 *, .jd-intro15 *::before, .jd-intro15 *::after {box-sizing:border-box}
      .jd-intro15 .jd15-eyebrow {position:absolute;top:5vh;left:6vw;letter-spacing:.22em;text-transform:uppercase;font-size:10px;opacity:.55;line-height:1.5}
      .jd-intro15 .jd15-skip {position:absolute;right:6vw;top:5vh;background:transparent;border:0;color:var(--jd15-ink);cursor:pointer;font:10px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.17em;text-transform:uppercase;opacity:.6;padding:10px;z-index:2}
      .jd-intro15 .jd15-skip:hover,.jd-intro15 .jd15-skip:focus-visible {opacity:1;text-decoration:underline;text-underline-offset:5px}
      .jd-intro15 .jd15-dial-wrap {width:min(54vh,68vw,510px);aspect-ratio:1;min-width:230px;position:relative;display:grid;place-items:center;filter:drop-shadow(0 35px 36px rgba(62,58,49,.12))}
      .jd-intro15 .jd15-dial {width:100%;height:100%;border-radius:50%;position:relative;background:radial-gradient(circle at 40% 29%,rgba(255,255,255,.98),rgba(246,244,239,.95) 19%,rgba(224,221,212,.9) 53%,rgba(177,174,164,.78) 85%,rgba(150,148,140,.78) 100%);box-shadow:inset 8px 12px 21px rgba(255,255,255,.8),inset -23px -22px 37px rgba(76,74,68,.12),0 23px 45px rgba(64,60,52,.13)}
      .jd-intro15 .jd15-dial::before {content:'';position:absolute;inset:12.5%;border:1px solid rgba(67,62,55,.16);border-radius:50%}
      .jd-intro15 .jd15-dial::after {content:'';position:absolute;inset:0;border-radius:50%;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.28) 43%,transparent 65%);pointer-events:none}
      .jd-intro15 .jd15-needle {position:absolute;left:50%;top:50%;width:2px;height:35%;background:linear-gradient(to top,#a36a47,#c38b64);border-radius:1px;transform-origin:50% 100%;transform:translate(-50%,-100%) rotate(30deg);box-shadow:0 0 8px rgba(168,116,79,.12);will-change:transform}
      .jd-intro15 .jd15-hub {position:absolute;left:50%;top:50%;width:7px;height:7px;border-radius:50%;background:#987459;transform:translate(-50%,-50%);box-shadow:0 0 0 2px rgba(255,255,255,.22)}
      .jd-intro15 .jd15-dial-mark {position:absolute;left:0;right:0;top:57%;text-align:center;letter-spacing:.35em;font-size:9px;color:rgba(35,35,32,.43)}
      .jd-intro15 .jd15-message {min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:30px}
      .jd-intro15 .jd15-word {font-weight:300;font-size:clamp(25px,4.3vw,52px);letter-spacing:.23em;text-transform:uppercase;display:flex;padding-left:.23em;gap:.01em;line-height:1.2}
      .jd-intro15 .jd15-letter {opacity:0;transform:translateY(12px);filter:blur(6px);transition:opacity .85s ease,transform .85s ease,filter .85s ease}
      .jd-intro15 .jd15-letter.shown {opacity:1;transform:translateY(0);filter:blur(0)}
      .jd-intro15 .jd15-subline {font-size:clamp(12px,1.25vw,16px);letter-spacing:.1em;font-style:italic;opacity:0;transform:translateY(8px);transition:opacity 1.2s ease,transform 1.2s ease;margin-top:15px;line-height:1.5}
      .jd-intro15 .jd15-subline.shown {opacity:.55;transform:translateY(0)}
      .jd-intro15 .jd15-hint {position:absolute;bottom:24px;font-size:10px;letter-spacing:.17em;opacity:.35;text-transform:uppercase}
      @media(max-width:600px){.jd-intro15 .jd15-dial-wrap{width:75vw;min-width:0}.jd-intro15 .jd15-message{margin-top:25px}.jd-intro15 .jd15-eyebrow,.jd-intro15 .jd15-skip{top:28px}}
      @media(prefers-reduced-motion:reduce){.jd-intro15 .jd15-letter,.jd-intro15 .jd15-subline{transition:none;filter:none;transform:none}}
    `;
    document.head.appendChild(styles);
    const section=document.createElement('section');
    section.className='jd-intro15';
    section.id='rallenta-intro';
    section.setAttribute('aria-label','Esperienza introduttiva Rallenta');
    // Markup adapted from jacopodoris-intro-v1.1.html; the demo portfolio is deliberately excluded.
    section.innerHTML=`
      <span class="jd15-eyebrow">An invitation to pause</span>
      <button class="jd15-skip" type="button">Vai al portfolio</button>
      <div class="jd15-dial-wrap"><div class="jd15-dial" role="img" aria-label="Orologio scultoreo con una sola lancetta che rallenta senza fermarsi"><div class="jd15-needle"></div><span class="jd15-hub"></span><span class="jd15-dial-mark">JD / SIGNAL</span></div></div>
      <div class="jd15-message"><div class="jd15-word" aria-label="Rallenta"></div><div class="jd15-subline">Sospendi il giudizio...</div></div>
      <span class="jd15-hint">jacopodoris.com</span>`;
    header.parentNode.insertBefore(section,header);
    // Ensure an ordinary homepage load starts at the introduction.
    if(!location.hash && window.scrollY<80) window.scrollTo({top:0,behavior:'instant'});
    const needle=section.querySelector('.jd15-needle');
    const word=section.querySelector('.jd15-word');
    const subline=section.querySelector('.jd15-subline');
    const skip=section.querySelector('.jd15-skip');
    const isEN=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false}};
    const translate=()=>{
      skip.textContent=isEN()?'Enter portfolio':'Vai al portfolio';
      subline.textContent=isEN()?'Suspend judgement...':'Sospendi il giudizio...';
    };
    translate();
    window.addEventListener('jd:languagechange',translate);
    let angle=30,previous=0,started=performance.now(),raf=null;
    function animate(now){
      const dt=Math.min((now-previous)/1000||0,.1);previous=now;
      const elapsed=(now-started)/1000;
      const velocity=6+104*Math.exp(-elapsed/3);
      angle+=velocity*dt;
      needle.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
      raf=requestAnimationFrame(animate);
    }
    if(!reduce) raf=requestAnimationFrame(animate);
    'RALLENTA'.split('').forEach((c,i)=>{
      const letter=document.createElement('span');letter.className='jd15-letter';letter.textContent=c;letter.setAttribute('aria-hidden','true');word.appendChild(letter);
      setTimeout(()=>letter.classList.add('shown'),reduce?0:2300+i*250);
    });
    setTimeout(()=>subline.classList.add('shown'),reduce?0:5400);
    let exited=false;
    const go=()=>{
      if(exited)return;
      exited=true;
      header.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
    };
    skip.addEventListener('click',go);
    // Do not take over scrolling if the visitor has already moved into the website.
    setTimeout(()=>{if(!exited && window.scrollY<100)go()},reduce?250:9800);
    // Pause the animation when the intro is out of view, to avoid unnecessary work.
    if('IntersectionObserver' in window && !reduce){
      const observer=new IntersectionObserver(entries=>{
        if(!entries[0]?.isIntersecting && raf!==null){cancelAnimationFrame(raf);raf=null}
        else if(entries[0]?.isIntersecting && raf===null){previous=performance.now();raf=requestAnimationFrame(animate)}
      },{threshold:0.01});
      observer.observe(section);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
