// JD / Public configuration — publishable Supabase key only. Never put Stripe secrets here.
window.JD_SUPABASE_URL='https://gyfufgvtyhxoxkwezgye.supabase.co';
window.JD_SUPABASE_ANON_KEY='sb_publishable_WmtEfC6rvrJMMRrJgo7eUg_OqnutoE5';
window.JD_BUCKET='jd-public-media';
(()=>{
  const launch=()=>{
    const scripts=[];
    if(document.getElementById('publishedChapters')){
      scripts.push('jd-sticky-works-v8-9-8.js');
      scripts.push('jd-mobile-nav-v8-9-11.js');
      scripts.push('jd-editions-gallery-v8-9-12.js');
      scripts.push('jd-brand-v8-9-13.js');
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
          child.textContent=child.textContent.replace(/V8\.9\.\d+/,'V8.9.13');
          break;
        }
      }
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',launch,{once:true});
  else launch();
})();
