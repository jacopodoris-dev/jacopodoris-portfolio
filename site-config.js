// JD / Public Supabase configuration. No Stripe secrets belong in this file.
window.JD_SUPABASE_URL='https://gyfufgvtyhxoxkwezgye.supabase.co';
window.JD_SUPABASE_ANON_KEY='sb_publishable_WmtEfC6rvrJMMRrJgo7eUg_OqnutoE5';
window.JD_BUCKET='jd-public-media';
// Keep the existing sticky editorial module and add responsive site navigation.
(()=>{
  for(const src of ['jd-sticky-works-v8-9-8.js','jd-mobile-nav-v8-9-11.js']){
    const script=document.createElement('script');
    script.src=src;
    script.defer=true;
    document.head.appendChild(script);
  }
  const stamp=()=>{const footer=document.querySelector('footer');if(!footer)return;for(const child of footer.children){if(/V8\.9\.\d+/.test(child.textContent||'')){child.textContent=child.textContent.replace(/V8\.9\.\d+/,'V8.9.11');break}}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stamp,{once:true});else stamp();
})();
