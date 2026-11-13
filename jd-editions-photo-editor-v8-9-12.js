/* JD Studio V8.9.12 - owner-only management of 5 additional photos per product. */
(()=>{
'use strict';
const container=document.getElementById('editions');if(!container)return;
const owner='feb9c40c-75ff-41fc-a92d-47f670d5d0ce';
const $=(id)=>document.getElementById(id);
const style=document.createElement('style');style.textContent=`
.jd12{margin:28px 0;border:1px solid #bfc3bc;background:#f9f8f4;padding:clamp(18px,3vw,35px)}
.jd12 h3{font-size:clamp(25px,3vw,38px);font-weight:300;margin:0 0 12px}
.jd12 .jd12-images{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:15px;margin:22px 0}
.jd12 .jd12-tile img{width:100%;aspect-ratio:4/5;object-fit:cover;background:#e3e3df}
.jd12 .jd12-tile small{display:block;font-size:11px;margin:7px 0}
.jd12 .jd12-actions{display:flex;gap:5px;flex-wrap:wrap}
.jd12 .jd12-actions button{font-size:11px;padding:8px 10px}
.jd12 .jd12-notice{font-size:13px;min-height:20px;color:#344f3d}
`;document.head.append(style);
const panel=document.createElement('section');panel.className='jd12';panel.innerHTML=`
<h3>Galleria fotografica prodotto</h3>
<p class="hint">Ogni creazione può avere 6 fotografie: copertina già caricata + fino a 5 immagini aggiuntive. Seleziona il prodotto e carica i nuovi scatti.</p>
<label>Prodotto esistente<select id="jd12Product"></select></label>
<div id="jd12Photos" class="jd12-images"></div>
<label>Aggiungi fotografie (JPG, PNG, WebP o AVIF; massimo 8 MB ciascuna)<input type="file" id="jd12Upload" multiple accept="image/jpeg,image/png,image/webp,image/avif"></label>
<button type="button" id="jd12Save">Carica fotografie</button>
<p class="jd12-notice" id="jd12Message" role="status"></p>`;
const productForm=$('productForm');if(productForm)container.insertBefore(panel,productForm);else container.append(panel);
const db=()=>window.supabase?.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
let products=[];const m=t=>$('jd12Message').textContent=t;
async function auth(){const d=db();if(!d)throw Error('Connessione Supabase non disponibile');const {data:{user},error}=await d.auth.getUser();if(error||user?.id!==owner)throw Error('Accedi come editor autorizzato.');return d}
const urls=p=>Array.isArray(p?.gallery_images)?p.gallery_images.filter(s=>typeof s==='string'&&s.startsWith('https://')).slice(0,5):[];
async function refresh(){const d=await auth();const {data,error}=await d.from('jd_products').select('id,title,cover_image,gallery_images').order('position');if(error)throw error;products=data||[];const selector=$('jd12Product'),selected=selector.value;selector.replaceChildren();products.forEach(p=>{const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.title;selector.append(opt)});if(products.some(p=>p.id===selected))selector.value=selected;render()}
function render(){const current=products.find(p=>p.id===$('jd12Product').value);const area=$('jd12Photos');area.replaceChildren();if(!current)return;const data=[current.cover_image,...urls(current)].filter(Boolean);data.forEach((url,index)=>{const tile=document.createElement('div');tile.className='jd12-tile';const img=document.createElement('img');img.src=url;img.alt='Immagine '+(index+1);img.loading='lazy';const label=document.createElement('small');label.textContent=index===0?'01 / COPERTINA':String(index+1).padStart(2,'0')+' / GALLERIA';tile.append(img,label);if(index>0){const actions=document.createElement('div');actions.className='jd12-actions';const make=(text,fn)=>{const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=text;b.onclick=fn;actions.append(b)};make('Rimuovi',()=>edit(index-1,'remove'));if(index>1)make('Su',()=>edit(index-1,'up'));if(index<data.length-1)make('Giù',()=>edit(index-1,'down'));tile.append(actions)}area.append(tile)})}
async function edit(i,action){try{const d=await auth(),p=products.find(p=>p.id===$('jd12Product').value);if(!p)return;const a=urls(p);if(action==='remove')a.splice(i,1);if(action==='up'&&i>0)[a[i-1],a[i]]=[a[i],a[i-1]];if(action==='down'&&i<a.length-1)[a[i+1],a[i]]=[a[i],a[i+1]];const {error}=await d.from('jd_products').update({gallery_images:a}).eq('id',p.id);if(error)throw error;p.gallery_images=a;render();m('Galleria aggiornata.')}catch(e){m('Errore: '+e.message)}}
$('jd12Product').addEventListener('change',render);
$('jd12Save').addEventListener('click',async()=>{const b=$('jd12Save');if(b.disabled)return;b.disabled=true;try{const d=await auth();const p=products.find(p=>p.id===$('jd12Product').value);if(!p)throw Error('Seleziona un prodotto');const existing=urls(p);const files=Array.from($('jd12Upload').files||[]);if(!files.length)throw Error('Seleziona almeno una fotografia.');if(existing.length+files.length>5)throw Error('Massimo 6 fotografie totali: copertina + 5 aggiuntive.');const mime=/^image\/(jpeg|png|webp|avif)$/;for(const f of files){if(!mime.test(f.type))throw Error('Formato non consentito: '+f.name);if(f.size>8*1024*1024)throw Error('File oltre 8 MB: '+f.name)}const appended=[...existing];for(const file of files){const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'})[file.type];const path=`editions/${p.id}/${crypto.randomUUID()}.${ext}`;const {error}=await d.storage.from(window.JD_BUCKET).upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;appended.push(d.storage.from(window.JD_BUCKET).getPublicUrl(path).data.publicUrl)}const {error}=await d.from('jd_products').update({gallery_images:appended}).eq('id',p.id);if(error)throw error;p.gallery_images=appended;$('jd12Upload').value='';render();m('Fotografie salvate. Il catalogo pubblico si aggiornerà al prossimo caricamento.')}catch(e){m('Errore: '+e.message)}finally{b.disabled=false}});
const tabs=document.querySelector('[data-tab="editions"]');tabs?.addEventListener('click',()=>refresh().catch(e=>m('Errore: '+e.message)));
})();
