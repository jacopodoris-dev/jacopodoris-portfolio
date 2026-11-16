// JD / Public configuration — publishable Supabase key only. Never put Stripe secrets here.
window.JD_SUPABASE_URL='https://gyfufgvtyhxoxkwezgye.supabase.co';
window.JD_SUPABASE_ANON_KEY='sb_publishable_WmtEfC6rvrJMMRrJgo7eUg_OqnutoE5';
window.JD_BUCKET='jd-public-media';

// Critical: hide the old opening hero before the Rallenta section is mounted,
// so the previous image never flashes at page start.
(()=>{
  const critical = document.createElement('style');
  critical.id='jd-rallenta17-critical';
  critical.textContent=`
    main#top > section#opening{
      opacity:0 !important;
      visibility:hidden !important;
      pointer-events:none !important;
      transform:translateY(0) !important;
    }
    body.jd-rallenta17-mounted main#top > section#opening{
      opacity:1 !important;
      visibility:visible !important;
      pointer-events:auto !important;
      transition:opacity .42s ease;
    }
  `;
  document.head.appendChild(critical);
})();

(()=>{
  const launch=()=>{
    const scripts=[];
    if(document.getElementById('publishedChapters')){
      scripts.push('jd-sticky-works-v8-9-8.js');
      scripts.push('jd-mobile-nav-v8-9-11.js');
      scripts.push('jd-editions-gallery-v8-9-12.js');
      scripts.push('jd-brand-v8-9-13.js');
      scripts.push('jd-rallenta-v8-9-17.js');
    }
    if(document.getElementById('editions')&&document.getElementById('dashboard')){
      scripts.push('jd-editions-photo-editor-v8-9-12.js');
    }
    for(const src of scripts){
      const s=document.createElement('script');
      s.src=src;
      s.defer=true;
      document.head.appendChild(s);
    }
    if(document.getElementById('publishedChapters')){
      const footer=document.querySelector('footer');
      for(const child of footer?.children||[]){
        if(/V8\.9\.\d+/.test(child.textContent||'')){
          child.textContent=child.textContent.replace(/V8\.9\.\d+/,'V8.9.17');
          break;
        }
      }
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',launch,{once:true});
  else launch();
})();
