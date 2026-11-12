/* JD V8.9.8 — sticky visual index, using only published Supabase work. */
(()=>{
  'use strict';
  const styles=`
  .jd-sw{background:#f5f4ef;padding:clamp(65px,9vw,145px) var(--edge,5vw);color:#191a1a}
  .jd-sw .jd-sw-kicker{font:11px/1.5 'Helvetica Neue',Arial,sans-serif;letter-spacing:.17em;color:#70736e;text-transform:uppercase;border-top:1px solid #b8bcb5;padding-top:16px;margin-bottom:45px}
  .jd-sw .jd-sw-heading{font-weight:300;letter-spacing:-.065em;font-size:clamp(48px,7vw,110px);line-height:1.02;margin:0 0 clamp(36px,5vw,75px)}
  .jd-sw-grid{display:grid;grid-template-columns:minmax(0,43%) minmax(0,57%);gap:clamp(24px,5vw,80px);align-items:start}
  .jd-sw-list{min-width:0}
  .jd-sw-work{padding:clamp(26px,4vw,60px) 0 clamp(45px,7vw,120px);border-top:1px solid #c7c9c2;opacity:.68;transition:opacity .4s}
  .jd-sw-work.is-current{opacity:1}
  .jd-sw-work small{font-size:10px;letter-spacing:.17em;color:#777b76}
  .jd-sw-work h3{font-size:clamp(29px,3.4vw,56px);line-height:1.06;font-weight:300;margin:14px 0 18px;letter-spacing:-.05em}
  .jd-sw-work .jd-sw-sub{font-size:clamp(17px,1.6vw,24px);font-weight:300;line-height:1.5;margin:0 0 22px}
  .jd-sw-work p.jd-sw-excerpt{font-size:clamp(15px,1.25vw,19px);line-height:1.85;hyphens:auto;text-align:justify;max-width:53ch;color:#464947;margin-bottom:20px}
  .jd-sw-thumb{width:min(75%,350px);aspect-ratio:4/3;object-fit:cover;margin:28px 0}
  .jd-sw-more{display:inline-block;border-bottom:1px solid currentColor;padding-bottom:6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
  .jd-sw-visual{position:sticky;top:clamp(15px,4vh,40px);height:calc(100vh - clamp(35px,7vh,100px));min-height:460px;max-height:1000px;overflow:hidden;background:#deded8}
  .jd-sw-visual img{height:100%;width:100%;object-fit:cover;display:block;transition:opacity .32s ease}
  .jd-sw-visual img.is-changing{opacity:.25}
  .jd-sw-photo-meta{position:absolute;left:clamp(16px,2vw,34px);right:clamp(16px,2vw,34px);bottom:clamp(16px,2vw,34px);color:white;z-index:1;display:flex;justify-content:space-between;gap:12px;align-items:end;text-shadow:0 1px 8px #0009;font:11px/1.5 'Helvetica Neue',Arial,sans-serif;letter-spacing:.14em}
  .jd-sw-visual::after{content:'';position:absolute;left:0;right:0;bottom:0;height:25%;background:linear-gradient(transparent,rgba(0,0,0,.48));pointer-events:none}
  @media(max-width:820px){.jd-sw-grid{grid-template-columns:1fr}.jd-sw-visual{position:relative;top:auto;grid-row:1;height:55svh;min-height:310px;max-height:none}.jd-sw-work{opacity:1;padding:25px 0 55px}.jd-sw-thumb{width:100%;max-width:400px}}
  @media(prefers-reduced-motion:reduce){.jd-sw-work,.jd-sw-visual img{transition:none}}
  `;
  const style=document.createElement('style');style.textContent=styles;document.head.appendChild(style);
  const lang=()=>{try{return localStorage.getItem('jd-language')==='en'?'en':'it'}catch{return 'it'}};
  const localized=(o,k)=>lang()==='en'&&typeof o?.[k+'_en']==='string'&&o[k+'_en'].trim()?o[k+'_en']:o?.[k]||'';
  const el=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x};
  const acceptable=url=>typeof url==='string'&&(/^(https:\/\/|assets\/)/).test(url);
  let records=[],observer=null,section=null,selected=-1;
  const label=()=>lang()==='en'?'SELECTED WORKS / FROM THE ARCHIVE':'PROGETTI SELEZIONATI / DALL’ARCHIVIO';
  function switchTo(i){if(i===selected||!records[i])return;selected=i;
    const img=section.querySelector('.jd-sw-visual img');
    const next=records[i].image;if(!next)return;
    section.querySelectorAll('.jd-sw-work').forEach((n,j)=>n.classList.toggle('is-current',j===i));
    const count=section.querySelector('.jd-sw-count');count.textContent=String(i+1).padStart(2,'0')+' / '+String(records.length).padStart(2,'0');
    img.classList.add('is-changing');
    const preload=new Image();preload.onload=()=>{if(selected===i){img.src=next;img.alt=localized(records[i],'title');img.classList.remove('is-changing')}};
    preload.onerror=()=>img.classList.remove('is-changing');preload.src=next;
  }
  function render(){if(!records.length||!section)return;
    observer?.disconnect();selected=-1;
    section.replaceChildren();
    section.append(el('div','jd-sw-kicker',label()),el('h2','jd-sw-heading',lang()==='en'?'A visual archive.':'Un archivio visivo.'));
    const grid=el('div','jd-sw-grid'),left=el('div','jd-sw-list'),right=el('div','jd-sw-visual');
    const display=el('img');display.src=records[0].image;display.alt=localized(records[0],'title');display.loading='lazy';
    const meta=el('div','jd-sw-photo-meta');meta.append(el('span','jd-sw-caption','JACOPO DORIS / WORKS'),el('span','jd-sw-count',`01 / ${String(records.length).padStart(2,'0')}`));right.append(display,meta);
    records.forEach((r,i)=>{
      const item=el('article','jd-sw-work');item.dataset.index=String(i);item.append(el('small','',String(i+1).padStart(2,'0')+' / WORKS'),el('h3','',localized(r,'title')));
      if(localized(r,'subtitle'))item.append(el('div','jd-sw-sub',localized(r,'subtitle')));
      const text=localized(r,'text');
      if(text){const paragraphs=text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);const chunks=paragraphs.length>1?paragraphs: text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.reduce((acc,s)=>{const last=acc.length-1;if(last>=0&&acc[last].length<220)acc[last]+=' '+s.trim();else acc.push(s.trim());return acc},[])||[text];
        chunks.slice(0,10).forEach(chunk=>{if(chunk)item.append(el('p','jd-sw-excerpt',chunk))})}
      // Thumbnail of the same published work supports the left-scrolling narrative.
      if(r.images.length>1){const thumb=el('img','jd-sw-thumb');thumb.src=r.images[1];thumb.alt=localized(r,'title');thumb.loading='lazy';item.append(thumb)}
      const a=el('a','jd-sw-more',lang()==='en'?'VIEW CHAPTER':'LEGGI IL CAPITOLO');a.href='#live';item.append(a);left.append(item);
    });
    grid.append(left,right);section.append(grid);
    if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(visible.length)switchTo(Number(visible[0].target.dataset.index));
    },{rootMargin:'-15% 0px -25% 0px',threshold:[0,.15,.35,.55,.8]});
    left.querySelectorAll('.jd-sw-work').forEach(x=>observer.observe(x))}
    switchTo(0);
  }
  async function init(){const before=document.getElementById('live');const dbapi=window.supabase;
    if(!before||!dbapi||!window.JD_SUPABASE_URL)return;
    try{
      const db=dbapi.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
      const {data:chapters,error}=await db.from('jd_chapters').select('id,title,title_en,subtitle,subtitle_en,position').eq('status','published').order('position');if(error)throw error;
      for(const ch of chapters||[]){
        const {data:pages,error:pe}=await db.from('jd_pages').select('id').eq('chapter_id',ch.id).order('position');if(pe)continue;
        const images=[],texts=[];for(const pg of pages||[]){const {data:blocks,error:be}=await db.from('jd_blocks').select('block_type,content').eq('page_id',pg.id).order('position');if(be)continue;
          for(const b of blocks||[]){const c=b.content||{};
            if(b.block_type==='image'&&acceptable(c.url))images.push(c.url);
            if(b.block_type==='gallery'&&Array.isArray(c.images))c.images.forEach(v=>{if(acceptable(v.url))images.push(v.url)});
            if(['text','quote'].includes(b.block_type)&&c.text)texts.push(c);
          }}
        if(images.length){records.push({...ch,image:images[0],images,text:texts.map(c=>c.text).join('\n\n'),text_en:texts.map(c=>c.text_en||c.text||'').join('\n\n')})}
      }
      if(!records.length)return;
      section=el('section','jd-sw');section.id='selected-works';section.setAttribute('aria-label','Selected Works');before.parentNode.insertBefore(section,before);render();
      window.addEventListener('jd:languagechange',render);
    }catch(err){console.warn('Selected Works non disponibile:',err.message)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
