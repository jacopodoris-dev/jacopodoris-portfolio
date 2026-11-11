(()=>{
  const stack=document.getElementById('photoStack');
  const toggle=document.getElementById('stackToggle');
  const setStack=on=>{stack?.classList.toggle('collected',on);if(toggle)toggle.textContent=on?'SEPARA LE PAGINE ↗':'RACCOGLI LE PAGINE ↗'};
  let manually=false;
  stack?.addEventListener('mouseenter',()=>{if(!manually)setStack(true)});
  stack?.addEventListener('mouseleave',()=>{if(!manually)setStack(false)});
  stack?.addEventListener('focus',()=>setStack(true));
  stack?.addEventListener('blur',()=>{if(!manually)setStack(false)});
  toggle?.addEventListener('click',()=>{manually=!manually;setStack(manually)});
  const meter=document.getElementById('readingMeter');
  const progress=()=>{const end=document.documentElement.scrollHeight-innerHeight; if(meter)meter.style.transform='scaleX('+(end>0?Math.min(1,scrollY/end):0)+')'};
  addEventListener('scroll',progress,{passive:true}); addEventListener('resize',progress); progress();
  const status=document.getElementById('liveStatus'),target=document.getElementById('publishedChapters');
  function element(tag,klass,text){const e=document.createElement(tag);if(klass)e.className=klass;if(text!==undefined)e.textContent=text;return e}
  function image(url,caption){if(!/^https:\/\//.test(url)&&!url.startsWith('assets/'))return null;const f=element('figure','public-block');const i=element('img');i.src=url;i.loading='lazy';i.alt=caption||'Fotografia editoriale';f.append(i);if(caption)f.append(element('figcaption','',caption));return f}
  async function loadPublished(){
    if(!window.supabase||!window.JD_SUPABASE_URL){status.textContent='Anteprima locale: collegamento Supabase non disponibile.';return}
    try{
      const db=window.supabase.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
      const {data:chapters,error}=await db.from('jd_chapters').select('id,title,subtitle,position,status').eq('status','published').order('position',{ascending:true});
      if(error)throw error;
      if(!chapters?.length){status.textContent='Nessun capitolo pubblicato. «Studi sulla luce» è una bozza: le pagine di esempio qui sopra sono un progetto grafico, non un contenuto pubblicato.';return}
      status.textContent=`${chapters.length} ${chapters.length===1?'capitolo pubblicato':'capitoli pubblicati'} nel libro.`;
      for(const ch of chapters){
        const card=element('article','published-card');card.append(element('div','eyebrow','DALL’ARCHIVIO EDITORIALE'));card.append(element('h3','',ch.title));if(ch.subtitle)card.append(element('p','',ch.subtitle));target.append(card);
        const {data:pages,error:err}=await db.from('jd_pages').select('id,layout,position').eq('chapter_id',ch.id).order('position');if(err)throw err;
        for(const p of pages||[]){const wrap=element('div','public-page');wrap.dataset.layout=p.layout||'editorial';card.append(wrap);
          const {data:blocks,error:be}=await db.from('jd_blocks').select('block_type,content,position').eq('page_id',p.id).order('position');if(be)throw be;
          for(const b of blocks||[]){const c=b.content||{};
            if(b.block_type==='image'){const img=image(c.url||'',c.caption||'');if(img)wrap.append(img)}
            else if(b.block_type==='gallery'){for(const x of (Array.isArray(c.images)?c.images:[])){const im=image(x.url||'',x.caption||'');if(im)wrap.append(im)}}
            else if(b.block_type==='text')wrap.append(element('div','public-block', '')).lastChild?.append(element('p','',c.text||''));
            else if(b.block_type==='quote')wrap.append(element('div','public-block')).append(element('blockquote','',c.text||''));
            else if(b.block_type==='video'&&/^(https:\/\/|assets\/)/.test(c.url||'')){const div=element('div','public-block');const v=element('video');v.controls=true;v.playsInline=true;v.preload='metadata';v.src=c.url;v.style.width='100%';div.append(v);wrap.append(div)}
          }
        }
      }
    }catch(e){status.textContent='Il collegamento ai capitoli non è disponibile: '+e.message}
  }
  loadPublished();
  loadEditions();

  // Fail closed: without published, available works the Editions navigation and section stay hidden.
  async function loadEditions(){
    const section=document.getElementById('editions');
    const nav=document.querySelector('[data-editions-nav]');
    const catalog=document.getElementById('editionCatalog');
    if(!section||!catalog||!window.supabase||!window.JD_SUPABASE_URL)return;
    try{
      const db=window.supabase.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
      const {data:products,error}=await db.from('jd_products')
        .select('id,title,description,price_eur,stock,cover_image,category_id,position')
        .eq('status','published').gt('stock',0).order('position',{ascending:true});
      if(error)throw error;
      if(!products?.length)return;
      const ids=[...new Set(products.map(x=>x.category_id).filter(Boolean))];
      if(!ids.length)return;
      const {data:categories,error:ce}=await db.from('jd_categories').select('id,name,slug,position,status')
        .in('id',ids).eq('status','published').order('position',{ascending:true});
      if(ce)throw ce;
      const allowed=new Map((categories||[]).map(c=>[c.id,c]));
      const available=products.filter(x=>allowed.has(x.category_id)&&x.price_eur!=null&&!!x.cover_image);
      if(!available.length)return;
      for(const cat of categories||[]){
        const prods=available.filter(x=>x.category_id===cat.id);if(!prods.length)continue;
        const wrapper=element('div','edition-group');
        const h=element('h3','edition-category-name',cat.name);wrapper.append(h);
        const grid=element('div','edition-grid');
        for(const product of prods){
          const article=element('article','edition-product');
          if(product.cover_image&&(/^(https:\/\/|assets\/)/.test(product.cover_image))){
            const fig=image(product.cover_image,product.title);
            if(fig)article.append(fig);
          }
          article.append(element('h4','',product.title));
          if(product.description)article.append(element('p','',product.description));
          const meta=element('div','edition-product-meta');
          if(product.price_eur!=null)meta.append(element('span','',new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(product.price_eur)));
          meta.append(element('span','',`${product.stock} ${product.stock===1?'pezzo disponibile':'pezzi disponibili'}`));
          article.append(meta);grid.append(article);
        }
        wrapper.append(grid);catalog.append(wrapper);
      }
      if(!catalog.children.length)return;
      section.hidden=false;if(nav)nav.hidden=false;
    }catch(e){
      // A missing table, offline access or a failed request never exposes an empty shop.
      console.warn('Editions non disponibile:',e.message);
    }
  }
})();
