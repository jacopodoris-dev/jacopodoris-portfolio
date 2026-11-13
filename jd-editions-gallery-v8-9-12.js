/* JD / Editions 8.9.12 - catalogue alignment and six-photo lightbox.
 * Enhances existing public.js cards without changing Stripe/cart handlers. */
(()=>{
'use strict';
const catalog=document.getElementById('editionCatalog');if(!catalog)return;
const style=document.createElement('style');style.textContent=`
/* Book-like catalog grid */
#editionCatalog .edition-grid{align-items:stretch;row-gap:clamp(36px,5vw,80px)}
#editionCatalog .edition-product{display:flex;flex-direction:column;min-width:0;height:100%}
#editionCatalog .edition-product>figure{margin:0;aspect-ratio:4/5;overflow:hidden;background:#e9e8e3}
#editionCatalog .edition-product>figure img{width:100%;height:100%;aspect-ratio:auto!important;object-fit:cover;transition:transform .5s ease}
#editionCatalog .edition-product>figure:has(.jd-gallery-open){position:relative}
#editionCatalog .jd-gallery-open{position:absolute;inset:0;display:block;width:100%;height:100%;background:transparent;color:transparent;border:0;cursor:zoom-in;text-indent:-9999px;overflow:hidden}
#editionCatalog .edition-product>figure:has(.jd-gallery-open):hover img{transform:scale(1.025)}
#editionCatalog .edition-product h4{margin:20px 0 10px;font-size:clamp(21px,2.1vw,29px)}
#editionCatalog .edition-product>p{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;line-height:1.65;max-width:58ch!important;margin:0 0 16px}
#editionCatalog .jd-gallery-details-link{align-self:flex-start;border:0;border-bottom:1px solid #545954;background:transparent;color:#303331;padding:5px 0;font:11px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;margin:0 0 24px}
#editionCatalog .edition-product-meta{margin-top:auto!important;padding-top:18px;border-top:1px solid #bfc3bc;min-height:48px;align-items:center;font-variant-numeric:tabular-nums}
#editionCatalog .edition-product .jd-cart-trigger{width:100%;margin:15px 0 0;min-height:47px;flex-shrink:0}
.jd-gallery-backdrop[hidden],.jd-gallery-modal[hidden]{display:none!important}
.jd-gallery-backdrop{position:fixed;inset:0;background:#161918b3;z-index:10000}
.jd-gallery-modal{position:fixed;inset:3vh 3vw;z-index:10001;background:#f5f4ef;color:#181a19;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(290px,.9fr);max-width:1500px;margin:auto;box-shadow:0 30px 100px #0004;overflow:auto}
.jd-gallery-photo{min-width:0;display:flex;flex-direction:column;background:#e9e8e3;padding:clamp(15px,3vw,40px)}
.jd-gallery-primary{height:min(68vh,780px);width:100%;object-fit:contain;display:block}
.jd-gallery-navigation{display:flex;justify-content:space-between;gap:15px;align-items:center;margin:14px 0}
.jd-gallery-navigation button{background:transparent;border:1px solid #999f98;color:#262a27;padding:8px 16px;cursor:pointer;font:14px/1 Helvetica,Arial,sans-serif}
.jd-gallery-thumbs{display:flex;gap:8px;overflow-x:auto;padding:6px 1px 2px}
.jd-gallery-thumbs button{background:transparent;padding:0;border:2px solid transparent;cursor:pointer;flex:0 0 68px}
.jd-gallery-thumbs button[aria-current="true"]{border-color:#1f2623}
.jd-gallery-thumbs img{width:64px;height:75px;object-fit:cover}
.jd-gallery-info{padding:clamp(28px,5vw,74px);position:relative;min-width:0;overflow:auto}
.jd-gallery-close{position:absolute;right:20px;top:16px;background:transparent;border:0;cursor:pointer;font:13px Helvetica,Arial,sans-serif;padding:12px}
.jd-gallery-info h2{font-size:clamp(34px,4vw,67px);font-weight:300;letter-spacing:-.06em;line-height:1.05;margin:55px 0 20px}
.jd-gallery-description{font-size:clamp(15px,1.2vw,18px);line-height:1.75;white-space:pre-wrap;text-align:justify;hyphens:auto;overflow-wrap:anywhere}
.jd-gallery-price{padding-top:22px;border-top:1px solid #c5c8c1;font-size:19px;font-variant-numeric:tabular-nums;margin-top:30px}
body.jd-gallery-lock{overflow:hidden}
@media(max-width:750px){.jd-gallery-modal{inset:0;display:block}.jd-gallery-photo{padding:12px}.jd-gallery-primary{height:48vh}.jd-gallery-info{padding:25px 22px 45px}.jd-gallery-info h2{margin:25px 0 18px}.jd-gallery-close{position:fixed;right:12px;top:10px;background:#f5f4efdd;border-radius:25px;z-index:3}.jd-gallery-thumbs button{flex-basis:55px}.jd-gallery-thumbs img{width:51px;height:55px}}
@media(prefers-reduced-motion:reduce){#editionCatalog .edition-product>figure img{transition:none}}
`;document.head.appendChild(style);
const db=()=>window.supabase?.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
const en=()=>{try{return localStorage.getItem('jd-language')==='en'}catch{return false}};
const tr=(it,eng)=>en()?eng:it;
const localized=(p,k)=>en()&&typeof p[k+'_en']==='string'&&p[k+'_en'].trim()?p[k+'_en']:p[k]||'';
const isUrl=u=>typeof u==='string'&&(/^(https:\/\/|assets\/)/).test(u);
const node=(tag,cl,txt)=>{const el=document.createElement(tag);if(cl)el.className=cl;if(txt!==undefined)el.textContent=txt;return el};
const state={products:new Map(),pending:null,active:null,index:0,focus:null};
const backdrop=node('div','jd-gallery-backdrop');backdrop.hidden=true;
const modal=node('section','jd-gallery-modal');modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
const photoArea=node('div','jd-gallery-photo');const mainImg=node('img','jd-gallery-primary');const nav=node('div','jd-gallery-navigation');const prev=node('button','', '‹');const counter=node('span');const next=node('button','', '›');nav.append(prev,counter,next);const thumbs=node('div','jd-gallery-thumbs');photoArea.append(mainImg,nav,thumbs);
const info=node('div','jd-gallery-info');const close=node('button','jd-gallery-close');close.type='button';const title=node('h2');const description=node('div','jd-gallery-description');const price=node('div','jd-gallery-price');info.append(close,title,description,price);modal.append(photoArea,info);document.body.append(backdrop,modal);
const images=p=>[p.cover_image,...(Array.isArray(p.gallery_images)?p.gallery_images:[])].filter(isUrl).filter((url,i,a)=>a.indexOf(url)===i).slice(0,6);
function showImage(i){const p=state.active;if(!p)return;const arr=images(p);if(!arr.length)return;state.index=(i+arr.length)%arr.length;mainImg.src=arr[state.index];mainImg.alt=`${localized(p,'title')} — ${state.index+1}`;counter.textContent=`${state.index+1} / ${arr.length}`;thumbs.replaceChildren();arr.forEach((url,n)=>{const b=node('button');b.type='button';b.setAttribute('aria-label',tr('Mostra fotografia','Show photo')+' '+(n+1));b.setAttribute('aria-current',String(state.index===n));const img=node('img');img.src=url;img.alt='';img.loading='lazy';b.append(img);b.onclick=()=>showImage(n);thumbs.append(b)})}
function updateLanguage(){if(!state.active)return;const p=state.active;title.textContent=localized(p,'title');description.textContent=localized(p,'description');price.textContent=new Intl.NumberFormat(en()?'en-IE':'it-IT',{style:'currency',currency:'EUR'}).format(p.price_eur);close.textContent=tr('Chiudi','Close');close.setAttribute('aria-label',tr('Chiudi la galleria','Close gallery'));modal.setAttribute('aria-label',localized(p,'title'));showImage(state.index)}
function open(id,origin){const p=state.products.get(id);if(!p)return;state.active=p;state.focus=origin;state.index=0;backdrop.hidden=modal.hidden=false;document.body.classList.add('jd-gallery-lock');updateLanguage();close.focus()}
function dismiss(){if(modal.hidden)return;backdrop.hidden=modal.hidden=true;document.body.classList.remove('jd-gallery-lock');state.active=null;state.focus?.focus?.()}
close.onclick=dismiss;backdrop.onclick=dismiss;prev.onclick=()=>showImage(state.index-1);next.onclick=()=>showImage(state.index+1);
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dismiss()}else if(e.key==='ArrowRight'){e.preventDefault();showImage(state.index+1)}else if(e.key==='ArrowLeft'){e.preventDefault();showImage(state.index-1)}else if(e.key==='Tab'){const controls=[...modal.querySelectorAll('button:not([disabled])')];const pos=controls.indexOf(document.activeElement);if(e.shiftKey&&pos===0){e.preventDefault();controls[controls.length-1].focus()}else if(!e.shiftKey&&pos===controls.length-1){e.preventDefault();controls[0].focus()}}});
let startX=null;mainImg.addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.clientX??null},{passive:true});mainImg.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>55)showImage(state.index+(dx<0?1:-1))},{passive:true});
function decorate(){for(const card of catalog.querySelectorAll('.edition-product[data-product-id]')){if(card.querySelector('.jd-gallery-open'))continue;const id=card.dataset.productId;const figure=card.querySelector('figure');if(!figure)continue;const btn=node('button','jd-gallery-open',tr('Apri fotografie e dettagli','Open photos and details'));btn.type='button';btn.setAttribute('aria-label',tr('Fotografie e dettagli di ','Photos and details of ')+(card.querySelector('h4')?.textContent||''));btn.onclick=()=>open(id,btn);figure.append(btn);const detail=node('button','jd-gallery-details-link',tr('Fotografie e dettagli','Photos and details'));detail.type='button';detail.onclick=()=>open(id,detail);const meta=card.querySelector('.edition-product-meta');if(meta)card.insertBefore(detail,meta);else card.append(detail)}}
const observer=new MutationObserver(decorate);observer.observe(catalog,{childList:true,subtree:true});
async function refresh(){if(!db())return;try{const {data,error}=await db().from('jd_products').select('id,title,title_en,description,description_en,cover_image,gallery_images,price_eur').eq('status','published');if(error)throw error;state.products=new Map((data||[]).map(p=>[p.id,p]));decorate()}catch(e){console.warn('Galleria Editions:',e.message)}}
window.addEventListener('jd:languagechange',()=>{for(const card of catalog.querySelectorAll('.edition-product')){const b=card.querySelector('.jd-gallery-details-link');if(b)b.textContent=tr('Fotografie e dettagli','Photos and details');const trigger=card.querySelector('.jd-gallery-open');if(trigger)trigger.setAttribute('aria-label',tr('Fotografie e dettagli di ','Photos and details of ')+(card.querySelector('h4')?.textContent||''))}updateLanguage()});
refresh();
})();
