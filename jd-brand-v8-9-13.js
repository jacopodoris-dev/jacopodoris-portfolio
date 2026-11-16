/* JD V8.9.14 — Motion wordmark. jacopo enters from left, doris is revealed in place. */
(()=>{
  'use strict';
  const styles = document.createElement('style');
  styles.id = 'jd-wordmark-v8-9-14-styles';
  styles.textContent = `
    .site-nav a.brand.jd-wordmark {
      display: inline-flex;
      align-items: baseline;
      gap: 0;
      flex: 0 0 auto;
      white-space: nowrap;
      text-transform: none;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: clamp(20px, 2.2vw, 28px);
      line-height: 1;
      letter-spacing: -.045em;
      font-weight: 300;
      padding-right: clamp(15px, 2.5vw, 38px);
      border-right: 1px solid #8d8e89;
    }
    .site-nav .jd-wordmark-light { font-weight: 300; }
    .site-nav .jd-wordmark-heavy { font-weight: 700; }
    .site-nav a.brand.jd-wordmark.jd-wordmark-animate .jd-wordmark-light {
      animation: jd-jacopo-enter .82s cubic-bezier(.22,1,.36,1) both;
    }
    .site-nav a.brand.jd-wordmark.jd-wordmark-animate .jd-wordmark-heavy {
      animation: jd-doris-reveal .9s cubic-bezier(.22,1,.36,1) .55s both;
    }
    @keyframes jd-jacopo-enter {
      from { opacity: 0; transform: translateX(-34px); filter: blur(2px); }
      to { opacity: 1; transform: translateX(0); filter: blur(0); }
    }
    @keyframes jd-doris-reveal {
      from { opacity: 0; clip-path: inset(0 100% 0 0); transform: translateX(-9px); }
      to { opacity: 1; clip-path: inset(0 0 0 0); transform: translateX(0); }
    }
    @media(max-width:800px) {
      .site-nav a.brand.jd-wordmark {
        font-size: clamp(20px, 5vw, 27px);
        padding-right: 0;
        border-right: 0;
        letter-spacing: -.04em;
      }
    }
    @media(max-width:370px) {
      .site-nav a.brand.jd-wordmark { font-size: 20px; }
    }
    @media(prefers-reduced-motion:reduce) {
      .site-nav a.brand.jd-wordmark.jd-wordmark-animate .jd-wordmark-light,
      .site-nav a.brand.jd-wordmark.jd-wordmark-animate .jd-wordmark-heavy {
        animation: none;
        opacity: 1;
        transform: none;
        filter: none;
        clip-path: none;
      }
    }
  `;
  document.head.appendChild(styles);
  const render = () => {
    const brand = document.querySelector('.site-nav a.brand');
    if (!brand) return;
    const jacopo = document.createElement('span');
    jacopo.className = 'jd-wordmark-light';
    jacopo.textContent = 'jacopo';
    const doris = document.createElement('strong');
    doris.className = 'jd-wordmark-heavy';
    doris.textContent = 'doris';
    brand.replaceChildren(jacopo, doris);
    brand.classList.add('jd-wordmark');
    brand.setAttribute('aria-label', 'Jacopo Doris — homepage');
    // Animation is applied only once per page load. No looping or layout shifts.
    brand.classList.add('jd-wordmark-animate');
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, {once:true});
  else render();
})();
