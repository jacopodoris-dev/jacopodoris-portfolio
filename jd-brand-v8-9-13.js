/* JD V8.9.13 — brand wordmark only; no changes to navigation, editor or checkout. */
(()=>{
  'use strict';
  const render=()=>{
    const brand=document.querySelector('.site-nav a.brand');
    if(!brand || brand.classList.contains('jd-wordmark'))return;
    const light=document.createElement('span');
    light.className='jd-wordmark-light';
    light.textContent='jacopo';
    const heavy=document.createElement('strong');
    heavy.className='jd-wordmark-heavy';
    heavy.textContent='doris';
    brand.replaceChildren(light,heavy);
    brand.classList.add('jd-wordmark');
    brand.setAttribute('aria-label','Jacopo Doris — homepage');
  };
  const css=document.createElement('style');
  css.id='jd-wordmark-style';
  css.textContent=`
  .site-nav a.brand.jd-wordmark {
    display:inline-flex;
    align-items:baseline;
    gap:0;
    flex:0 0 auto;
    white-space:nowrap;
    text-transform:none;
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size:clamp(20px,2.2vw,28px);
    line-height:1;
    letter-spacing:-.045em;
    font-weight:300;
    padding-right:clamp(15px,2.5vw,38px);
    border-right:1px solid #8d8e89;
  }
  .jd-wordmark-light {font-weight:300;}
  .jd-wordmark-heavy {font-weight:700;}
  @media(max-width:800px){
    .site-nav a.brand.jd-wordmark {
      font-size:clamp(20px,5vw,27px);
      padding-right:0;
      border-right:0;
      letter-spacing:-.04em;
    }
  }
  @media(max-width:370px){
    .site-nav a.brand.jd-wordmark{font-size:20px}
  }
  `;
  document.head.append(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
  else render();
})();
