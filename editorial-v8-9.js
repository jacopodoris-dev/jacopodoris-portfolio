/* JD V8.9 — Readable chapter spreads + local prototype cart. No payments or orders. */
(()=>{
'use strict';
const $=(sel,root=document)=>root.querySelector(sel);
const money=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n);
const key='jd-editions-cart-v8-9';
let basket={};try{basket=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{basket={}}
let currentProducts=new Map();
function save(){try{localStorage.setItem(key,JSON.stringify(basket))}catch{}}
function classify(){document.querySelectorAll('#publishedChapters .public-page').forEach(page=>{const hasImage=!!page.querySelector('img');const hasText=!!page.querySelector('p,blockquote');page.classList.toggle('is-text-only',hasText&&!hasImage);page.classList.toggle('is-image-only',hasImage&&!hasText)})}
const watched=$('#publishedChapters');if(watched){new MutationObserver(classify).observe(watched,{childList:true,subtree:true});classify()}
const trigger=document.createElement('button');trigger.className='jd-cart-top';trigger.type='button';trigger.hidden=true;
const overlay=document.createElement('div');overlay.className='jd-cart-overlay';overlay.hidden=true;
const drawer=document.createElement('aside');drawer.className='jd-cart-drawer';drawer.hidden=true;drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-label','Carrello Editions');
drawer.innerHTML='<header><h2>Il tuo carrello.</h2><button type="button" class="jd-cart-close" aria-label="Chiudi carrello">Chiudi ×</button></header><div class="jd-cart-list" aria-live="polite"></div><div class="jd-cart-footer"><div class="jd-cart-total"><span>Totale provvisorio</span><strong></strong></div><p class="jd-cart-note">Selezione dimostrativa. Prezzi e disponibilità sono indicativi fino alla verifica del catalogo. Nessun ordine viene inviato e nessun pagamento viene addebitato.</p><button type="button" class="jd-cart-checkout" disabled>Acquisto non ancora attivo</button></div>';
document.body.append(trigger,overlay,drawer);
let lastFocus=null;
function openCart(){lastFocus=document.activeElement;overlay.hidden=drawer.hidden=false;renderCart();$('.jd-cart-close',drawer).focus()}
function closeCart(){overlay.hidden=drawer.hidden=true;lastFocus?.focus?.()}
trigger.addEventListener('click',openCart);overlay.addEventListener('click',closeCart);$('.jd-cart-close',drawer).addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)closeCart()});
function count(){return Object.values(basket).reduce((a,b)=>a+(Number(b.qty)||0),0)}
function updateTrigger(){trigger.textContent='CARRELLO / '+count();trigger.hidden=!document.getElementById('editions')||document.getElementById('editions').hidden}
function renderCart(){const list=$('.jd-cart-list',drawer);list.replaceChildren();let total=0;for(const [id,entry] of Object.entries(basket)){
 const p=currentProducts.get(id);if(!p){delete basket[id];continue}const qty=Math.max(0,Math.min(p.stock,Number(entry.qty)||0));if(!qty){delete basket[id];continue}entry.qty=qty;total+=qty*Number(p.price_eur);
 const item=document.createElement('div');item.className='jd-cart-item';const img=document.createElement('img');img.src=p.cover_image;img.alt=p.title;const content=document.createElement('div');const title=document.createElement('strong');title.textContent=p.title;const price=document.createElement('p');price.textContent=money(Number(p.price_eur))+' / pezzo';const controls=document.createElement('div');
 const less=document.createElement('button');less.className='jd-cart-small-btn';less.textContent='−';less.setAttribute('aria-label','Riduci quantità');less.onclick=()=>change(id,-1);
 const n=document.createElement('span');n.textContent=' '+qty+' ';
 const more=document.createElement('button');more.className='jd-cart-small-btn';more.textContent='+';more.disabled=qty>=p.stock;more.setAttribute('aria-label','Aumenta quantità');more.onclick=()=>change(id,1);
 const rm=document.createElement('button');rm.className='jd-cart-small-btn';rm.textContent='Rimuovi';rm.onclick=()=>{delete basket[id];save();renderCart();updateTrigger()};
 controls.append(less,n,more,rm);content.append(title,price,controls);item.append(img,content);list.append(item)
 }if(!list.childElementCount){const p=document.createElement('p');p.textContent='Nessuna creazione selezionata.';list.append(p)}$('.jd-cart-total strong',drawer).textContent=money(total);save();updateTrigger()}
function change(id,delta){const p=currentProducts.get(id);if(!p)return;const n=Math.max(0,Math.min(p.stock,(basket[id]?.qty||0)+delta));if(n)basket[id]={qty:n};else delete basket[id];save();renderCart()}
async function attachCart(){if(!window.supabase||!window.JD_SUPABASE_URL||!window.JD_SUPABASE_ANON_KEY)return;
 const db=window.supabase.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
 const {data,error}=await db.from('jd_products').select('id,title,price_eur,cover_image,stock,status,category_id').eq('status','published').gt('stock',0);
 if(error||!data?.length)return;const ids=[...new Set(data.map(p=>p.category_id))];const {data:categories,error:ce}=await db.from('jd_categories').select('id,status').in('id',ids).eq('status','published');if(ce)return;const allowed=new Set((categories||[]).map(c=>c.id));currentProducts=new Map(data.filter(p=>allowed.has(p.category_id)&&p.cover_image&&p.price_eur!=null).map(p=>[p.id,p]));
 const catalog=$('#editionCatalog');if(!catalog)return;
 function decorate(){const cards=[...catalog.querySelectorAll('.edition-product')];const used=new Set();for(const card of cards){if(card.querySelector('.jd-cart-trigger'))continue;const title=$('h4',card)?.textContent?.trim();const product=[...currentProducts.values()].find(p=>p.title===title&&!used.has(p.id));if(!product)continue;used.add(product.id);const btn=document.createElement('button');btn.className='jd-cart-trigger';btn.type='button';btn.textContent='Aggiungi al carrello ↗';btn.onclick=()=>{change(product.id,1);openCart()};card.append(btn)}updateTrigger()}
 const obs=new MutationObserver(decorate);obs.observe(catalog,{childList:true,subtree:true});decorate();
 setTimeout(()=>{decorate();obs.disconnect()},15000)
}
attachCart().catch(()=>{});
})();
