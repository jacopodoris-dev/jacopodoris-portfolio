/* JD Studio V8.9.10 — Navigation only. Does not alter data, auth or Stripe. */
(()=>{
'use strict';
const dashboard=document.getElementById('dashboard');
if(!dashboard) return;
const style=document.createElement('style');
style.textContent=`
  body:has(#dashboard:not([hidden])) > header{position:sticky;top:0;z-index:50;background:#eeede8;height:68px;box-shadow:0 1px 0 #cbcfc9}
  #dashboard .tabs{position:sticky;top:68px;z-index:45;background:#eeede8;padding-top:8px;margin-top:16px;border-bottom:1px solid #bbc0b8}
  #dashboard .tabs button{padding:12px 18px}
  #dashboard .jd-nav-quick{display:none}
  .jd-nav-quick button{border:0;background:none;color:#3f4540;padding:9px 12px;text-align:left;font:13px/1.3 'Helvetica Neue',Helvetica,Arial,sans-serif;width:100%;border-radius:3px}
  .jd-nav-quick button:hover,.jd-nav-quick button:focus-visible{background:#dedfd8;color:#151816}
  .jd-nav-quick .jd-nav-title{display:block;border-top:1px solid #b8bcb5;padding:15px 12px 10px;font-size:10px;letter-spacing:.15em;color:#6e736e}
  .jd-nav-quick button.is-active{color:#151816;font-weight:600;border-left:2px solid #9f806f}
  #chapters [id],#editions [id],#translations [id]{scroll-margin-top:158px}
  #jd99-editor,.jd99{scroll-margin-top:158px}
  @media(min-width:1180px){
    body:has(#dashboard:not([hidden])) main{max-width:1380px;padding-left:230px;padding-right:48px}
    #dashboard .jd-nav-quick{display:flex;position:fixed;z-index:44;left:max(22px,calc((100vw - 1380px)/2 + 20px));top:101px;width:180px;max-height:calc(100vh - 122px);overflow:auto;flex-direction:column;gap:2px;padding:4px 0}
  }
  @media(min-width:650px) and (max-width:1179px){
    #dashboard .jd-nav-quick{display:flex;position:sticky;top:122px;z-index:40;overflow:auto;background:#f3f2ee;padding:5px;gap:3px;border-bottom:1px solid #c5c8c0;white-space:nowrap}
    .jd-nav-quick .jd-nav-title{display:none}
    .jd-nav-quick button{width:auto;flex:0 0 auto;padding:9px 12px}
  }
  @media(max-width:649px){
    body:has(#dashboard:not([hidden])) > header{position:relative;height:76px}
    #dashboard .tabs{top:0;overflow:auto;white-space:nowrap}
    #dashboard .jd-nav-quick{display:flex;position:sticky;top:50px;z-index:40;overflow:auto;background:#f3f2ee;padding:4px;gap:2px;white-space:nowrap}
    .jd-nav-quick .jd-nav-title{display:none}
    .jd-nav-quick button{width:auto;flex:0 0 auto;padding:7px 9px;font-size:11px}
  }
`;
document.head.append(style);
const nav=document.createElement('nav');nav.className='jd-nav-quick';nav.setAttribute('aria-label','Navigazione rapida editor');
const entries=[
 ['Capitoli','chapters','chapters'],
 ['Nuovo capitolo','chapterForm','chapters'],
 ['Testi IT / EN','jd99-editor','chapters'],
 ['Fotografie','chapterImageFile','chapters'],
 ['Anteprima','jd99PreviewIT','chapters'],
 ['Categorie','categoryForm','editions'],
 ['Nuovo prodotto','productForm','editions'],
 ['Modifica prodotti','jd99Product','editions'],
 ['Traduzioni','translations','translations']
];
const title=document.createElement('span');title.className='jd-nav-title';title.textContent='JD STUDIO / NAVIGA';nav.append(title);
function go(id,tab){
 const tabButton=dashboard.querySelector(`[data-tab="${tab}"]`);
 const tabBody=document.getElementById(tab);
 if(tabBody?.hidden)tabButton?.click();
 let node=document.getElementById(id);
 if(id==='chapterImageFile')node=node?.closest('label')||node;
 if(id==='jd99PreviewIT')node=node?.closest('.jd99-actions')||node;
 if(!node||node.closest('[hidden]'))node=tabBody;
 node?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 nav.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b.dataset.destination===id));
}
for(const [label,id,tab] of entries){
 const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.destination=id;
 button.onclick=()=>go(id,tab);nav.append(button);
}
const tabs=dashboard.querySelector('.tabs');tabs?.insertAdjacentElement('afterend',nav);
})();