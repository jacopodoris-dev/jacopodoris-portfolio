/* JD / V8.9.11 — Responsive navigation. Desktop header remains unchanged. */
(()=>{
  'use strict';
  const boot=()=>{
    const header=document.querySelector('.site-nav');
    const nav=header?.querySelector('nav');
    const languages=header?.querySelector('.jd-language-switch');
    const studio=header?.querySelector('.nav-studio');
    if(!header||!nav||!languages||!studio)return;
    const css=document.createElement('style');
    css.textContent=`
      .jd-mobile-trigger{display:none!important}
      .jd-mobile-panel{display:contents}
      @media(max-width:800px){
        .site-nav{position:relative;z-index:50;display:flex;flex-wrap:nowrap;align-items:center;justify-content:space-between;min-height:70px;padding:15px clamp(18px,5vw,32px);gap:12px}
        .site-nav .brand{font-size:clamp(19px,4.8vw,26px);letter-spacing:-.035em;font-weight:300;text-transform:none}
        .site-nav .jd-mobile-trigger{display:flex!important;flex-direction:column;justify-content:center;align-items:center;gap:6px;width:46px;height:44px;background:transparent;color:inherit;border:0;padding:7px;cursor:pointer}
        .jd-mobile-trigger span{display:block;height:1.5px;width:25px;background:currentColor;transition:transform .22s,opacity .22s}
        .jd-mobile-trigger[aria-expanded="true"] span:first-child{transform:translateY(3.75px) rotate(45deg)}
        .jd-mobile-trigger[aria-expanded="true"] span:last-child{transform:translateY(-3.75px) rotate(-45deg)}
        .jd-mobile-panel{display:none;position:absolute;left:0;right:0;top:100%;background:#eeede8;border-top:1px solid #d3d2cc;border-bottom:1px solid #d3d2cc;padding:22px clamp(18px,5vw,32px) 30px;box-shadow:0 12px 22px #0000000c}
        .jd-mobile-panel.is-open{display:flex;flex-direction:column;gap:25px}
        .site-nav .jd-mobile-panel nav{display:flex;order:initial;width:100%;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:0}
        .site-nav .jd-mobile-panel nav a{display:block;padding:12px 0;border-bottom:1px solid #d5d4ce;font-size:18px;letter-spacing:.035em;font-weight:300}
        .site-nav .jd-mobile-panel .jd-language-switch{align-self:flex-start;margin:2px 0}
        .site-nav .jd-mobile-panel .nav-studio{align-self:flex-start;font-size:12px;letter-spacing:.08em;padding:8px 0}
      }
      @media(prefers-reduced-motion:reduce){.jd-mobile-trigger span{transition:none}}
    `;
    document.head.appendChild(css);
    const button=document.createElement('button');
    button.type='button';button.className='jd-mobile-trigger';
    button.setAttribute('aria-label','Apri menu');
    button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','jd-mobile-panel');
    button.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span>';
    const panel=document.createElement('div');panel.id='jd-mobile-panel';panel.className='jd-mobile-panel';
    panel.append(nav,languages,studio);
    header.append(button,panel);
    const close=()=>{panel.classList.remove('is-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',document.documentElement.lang==='en'?'Open menu':'Apri menu')};
    button.addEventListener('click',()=>{
      const opening=!panel.classList.contains('is-open');
      panel.classList.toggle('is-open',opening);
      button.setAttribute('aria-expanded',String(opening));
      button.setAttribute('aria-label',opening?(document.documentElement.lang==='en'?'Close menu':'Chiudi menu'):(document.documentElement.lang==='en'?'Open menu':'Apri menu'));
    });
    nav.addEventListener('click',event=>{if(event.target.closest('a'))close()});
    studio.addEventListener('click',close);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('is-open')){close();button.focus()}});
    document.addEventListener('pointerdown',event=>{if(panel.classList.contains('is-open')&&!header.contains(event.target))close()});
    const desktop=window.matchMedia('(min-width: 801px)');
    desktop.addEventListener?.('change',event=>{if(event.matches)close()});
    window.addEventListener('jd:languagechange',()=>{button.setAttribute('aria-label',panel.classList.contains('is-open')?(document.documentElement.lang==='en'?'Close menu':'Chiudi menu'):(document.documentElement.lang==='en'?'Open menu':'Apri menu'))});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
