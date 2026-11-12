/* Jacopo Doris V8.9.9 — additive bilingual editor. RLS remains authoritative. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const owner='feb9c40c-75ff-41fc-a92d-47f670d5d0ce';
const host=$('chapters'), editions=$('editions');
if(!host||!editions||!window.supabase||!window.JD_SUPABASE_URL)return;
const db=window.supabase.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
const style=document.createElement('style');style.textContent=`
.jd99{border:1px solid #b7bab3;background:#faf9f6;padding:clamp(20px,3vw,36px);margin:25px 0 35px}
.jd99 h3{margin:0 0 15px;font-size:clamp(25px,3vw,38px);font-weight:300;letter-spacing:-.045em}
.jd99-head{display:flex;justify-content:space-between;gap:15px;align-items:center;border-bottom:1px solid #d8dad3;padding-bottom:18px;margin-bottom:20px}
.jd99-head small{font-size:10px;letter-spacing:.12em;color:#656a64}
.jd99-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 25px}
.jd99 label{display:block;font-size:12px;color:#454b46;margin:12px 0 0}
.jd99 label input,.jd99 label textarea,.jd99 label select{width:100%;margin:7px 0 0;background:white}
.jd99 .jd99-actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 12px}
.jd99 .jd99-actions button{font-size:13px}
.jd99 .jd99-note{font-size:12px;color:#606862;margin:9px 0 12px}
.jd99 .jd99-message{font-size:13px;min-height:20px;color:#3a5142}
.jd99-preview{border-top:1px solid #d8dad3;margin-top:24px;padding-top:24px}
.jd99-preview .jd99-sheet{background:#fff;border:1px solid #e6e3dc;padding:clamp(16px,3vw,40px);margin:16px 0}
.jd99-preview h4{font-weight:300;font-size:clamp(26px,4vw,48px)}
.jd99-preview img{display:block;width:100%;max-height:530px;object-fit:contain;margin:15px auto}
.jd99-preview p,.jd99-preview blockquote{white-space:pre-wrap;text-align:justify;hyphens:auto;line-height:1.8;max-width:68ch}
.jd99-preview figure{margin:0 0 22px}.jd99-preview figcaption{font-size:11px;color:#606861}
.jd99 details{border-top:1px solid #d8dad3;padding-top:16px;margin-top:22px}
.jd99 summary{cursor:pointer;font-size:13px}
@media(max-width:680px){.jd99-grid{grid-template-columns:1fr}.jd99-head{align-items:start;flex-direction:column}}
`;document.head.append(style);
const panel=document.createElement('section');panel.className='jd99';panel.id='jd99-editor';panel.innerHTML=`
<div class="jd99-head"><div><small>JD STUDIO / V8.9.9</small><h3>Scrivi in due lingue.</h3></div><button type="button" class="secondary" id="jd99Refresh">Aggiorna contenuti</button></div>
<p class="jd99-note">Testi italiani e inglesi nella stessa schermata. Le modifiche ai capitoli già pubblicati diventano visibili sul sito quando salvi.</p>
<label>Seleziona capitolo<select id="jd99Chapter"></select></label>
<div class="jd99-grid">
<label>Titolo italiano (IT)<input id="jd99TitleIT"></label><label>English title (EN)<input id="jd99TitleEN"></label>
<label>Sottotitolo italiano (IT)<textarea rows="2" id="jd99SubIT"></textarea></label><label>English subtitle (EN)<textarea rows="2" id="jd99SubEN"></textarea></label>
</div>
<div class="jd99-actions"><button type="button" id="jd99SaveChapter">Salva titolo e sottotitolo</button><button type="button" class="secondary" id="jd99NewChapter">Crea nuovo capitolo in bozza</button></div>
<hr>
<h3>Testi e fotografie del capitolo</h3>
<label>Pagina<select id="jd99Page"></select></label>
<label>Seleziona blocco (oppure crea un nuovo testo)<select id="jd99Block"></select></label>
<div class="jd99-grid"><label>Testo / didascalia italiana (IT)<textarea rows="6" id="jd99TextIT"></textarea></label><label>English text / caption (EN)<textarea rows="6" id="jd99TextEN"></textarea></label></div>
<div class="jd99-actions"><button type="button" id="jd99SaveBlock">Salva testo IT / EN</button><button type="button" class="secondary" id="jd99AddBlock">Aggiungi nuovo testo IT / EN</button><button type="button" class="secondary" id="jd99Up">Sposta blocco su</button><button type="button" class="secondary" id="jd99Down">Sposta blocco giù</button></div>
<p class="jd99-note">Per caricare nuove fotografie rimangono disponibili gli strumenti qui sotto. Per modificare le didascalie, seleziona il blocco immagine in questa sezione.</p>
<div class="jd99-actions"><button type="button" class="secondary" id="jd99PreviewIT">Anteprima italiana</button><button type="button" class="secondary" id="jd99PreviewEN">English preview</button></div>
<p id="jd99Message" class="jd99-message" role="status" aria-live="polite"></p>
<div id="jd99Preview" class="jd99-preview" hidden></div>
`;host.insertBefore(panel,$('chapterForm'));
const productPanel=document.createElement('section');productPanel.className='jd99';productPanel.innerHTML=`
<div class="jd99-head"><div><small>EDITIONS / V8.9.9</small><h3>Prodotti IT / EN.</h3></div><button type="button" class="secondary" id="jd99RefreshProducts">Aggiorna prodotti</button></div>
<label>Seleziona creazione esistente<select id="jd99Product"></select></label>
<div class="jd99-grid">
<label>Nome prodotto (IT)<input id="jd99ProductTitleIT"></label><label>Product name (EN)<input id="jd99ProductTitleEN"></label>
<label>Descrizione (IT)<textarea rows="5" id="jd99ProductDescIT"></textarea></label><label>Description (EN)<textarea rows="5" id="jd99ProductDescEN"></textarea></label>
</div>
<div class="jd99-actions"><button type="button" id="jd99SaveProduct">Salva prodotto IT / EN</button></div>
<p id="jd99ProductMessage" class="jd99-message" role="status" aria-live="polite"></p>
`;editions.insertBefore(productPanel,$('categoryForm'));
const msg=(s,prod=false)=>{$(prod?'jd99ProductMessage':'jd99Message').textContent=s};
const check=async()=>{const {data:{user},error}=await db.auth.getUser();if(error||user?.id!==owner)throw Error('Accedi prima con l’account editoriale di Jacopo.');};
const get=async(q)=>{const {data,error}=await q;if(error)throw Error(error.message);return data||[]};
const choose=(id,items,label)=>{const e=$(id),before=e.value;e.replaceChildren();for(const item of items){const o=document.createElement('option');o.value=item.id;o.textContent=label(item);e.append(o)}if(items.some(x=>x.id===before))e.value=before};
const localized=(obj,k,lang)=>lang==='en'?(obj?.[k+'_en']||obj?.[k]||''):(obj?.[k]||'');
let chapters=[],pages=[],blocks=[],products=[];
const chapter=()=>chapters.find(c=>c.id===$('jd99Chapter').value);
const page=()=>pages.find(p=>p.id===$('jd99Page').value);
const block=()=>blocks.find(b=>b.id===$('jd99Block').value);
const product=()=>products.find(p=>p.id===$('jd99Product').value);
function fillChapter(){$('jd99Preview').hidden=true;const c=chapter();$('jd99TitleIT').value=c?.title||'';$('jd99TitleEN').value=c?.title_en||'';$('jd99SubIT').value=c?.subtitle||'';$('jd99SubEN').value=c?.subtitle_en||'';loadPages().catch(e=>msg(e.message));}
async function loadChapters(){await check();chapters=await get(db.from('jd_chapters').select('id,title,title_en,subtitle,subtitle_en,status,position').order('position'));choose('jd99Chapter',chapters,c=>`${c.title} · ${c.status==='published'?'pubblicato':'bozza'}`);fillChapter();msg('Capitoli caricati.');}
async function loadPages(){pages=[];blocks=[];if(chapter())pages=await get(db.from('jd_pages').select('id,position,layout').eq('chapter_id',chapter().id).order('position'));choose('jd99Page',pages,p=>`Pagina ${p.position} — ${p.layout||'editorial'}`);await loadBlocks()}
async function loadBlocks(){blocks=[];if(page())blocks=await get(db.from('jd_blocks').select('id,position,block_type,content').eq('page_id',page().id).order('position'));choose('jd99Block',blocks,b=>`${b.position} · ${b.block_type} · ${String(b.content?.text||b.content?.caption||'').slice(0,50)}`);fillBlock()}
function fillBlock(){const b=block(),key=b?.block_type==='image'?'caption':'text';$('jd99TextIT').value=b?.content?.[key]||'';$('jd99TextEN').value=b?.content?.[key+'_en']||'';const editable=!!b&&['text','quote','image'].includes(b.block_type);$('jd99SaveBlock').disabled=!editable;$('jd99Up').disabled=!editable;$('jd99Down').disabled=!editable;}
async function updated(table,id,changes){await check();const rows=await get(db.from(table).update(changes).eq('id',id).select('id'));if(!rows.length)throw Error('Modifica non autorizzata o nessuna riga aggiornata.');}
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36);
$('jd99Chapter').addEventListener('change',fillChapter);$('jd99Page').addEventListener('change',()=>loadBlocks().catch(e=>msg(e.message)));$('jd99Block').addEventListener('change',fillBlock);
$('jd99Refresh').onclick=()=>loadChapters().catch(e=>msg(e.message));
$('jd99SaveChapter').onclick=async()=>{try{const c=chapter();if(!c)throw Error('Seleziona un capitolo.');const title=$('jd99TitleIT').value.trim();if(!title)throw Error('Il titolo italiano è obbligatorio.');await updated('jd_chapters',c.id,{title,title_en:$('jd99TitleEN').value.trim()||null,subtitle:$('jd99SubIT').value.trim(),subtitle_en:$('jd99SubEN').value.trim()||null});msg('Titolo e sottotitolo salvati in IT / EN.');await loadChapters()}catch(e){msg('Errore: '+e.message)}};
$('jd99NewChapter').onclick=async()=>{try{await check();const title=prompt('Titolo italiano del NUOVO capitolo:','')?.trim();if(!title)return;const {data,error}=await db.from('jd_chapters').insert({title,title_en:null,subtitle:'',subtitle_en:null,slug:slug(title),status:'draft',position:chapters.reduce((a,c)=>Math.max(a,Number(c.position)||0),0)+1}).select('id').single();if(error)throw error;await loadChapters();$('jd99Chapter').value=data.id;fillChapter();msg('Nuovo capitolo creato in bozza. Non è pubblico.') }catch(e){msg('Errore: '+e.message)}};
$('jd99SaveBlock').onclick=async()=>{try{const b=block();if(!b||!['text','quote','image'].includes(b.block_type))throw Error('Seleziona un testo o una fotografia.');const key=b.block_type==='image'?'caption':'text';await updated('jd_blocks',b.id,{content:{...b.content,[key]:$('jd99TextIT').value.trim(),[key+'_en']:$('jd99TextEN').value.trim()}});msg('Testo e traduzione salvati.');await loadBlocks()}catch(e){msg('Errore: '+e.message)}};
$('jd99AddBlock').onclick=async()=>{try{await check();if(!chapter())throw Error('Seleziona un capitolo.');const it=$('jd99TextIT').value.trim(),en=$('jd99TextEN').value.trim();if(!it)throw Error('Scrivi prima il testo italiano.');let p=page();if(!p){const {data,error}=await db.from('jd_pages').insert({chapter_id:chapter().id,position:1,layout:'editorial'}).select('id,position,layout').single();if(error)throw error;p=data;}const pos=blocks.reduce((a,b)=>Math.max(a,Number(b.position)||0),0)+1;const {error}=await db.from('jd_blocks').insert({page_id:p.id,position:pos,block_type:'text',content:{text:it,text_en:en}});if(error)throw error;await loadPages();msg('Nuovo testo bilingue aggiunto al capitolo.')}catch(e){msg('Errore: '+e.message)}};
async function move(delta){try{const b=block();if(!b)throw Error('Seleziona un blocco.');const index=blocks.findIndex(x=>x.id===b.id),other=blocks[index+delta];if(!other)return;await check();const before=b.position,after=other.position;const temp=Math.max(...blocks.map(x=>Number(x.position)||0))+1000;await updated('jd_blocks',b.id,{position:temp});try{await updated('jd_blocks',other.id,{position:before});await updated('jd_blocks',b.id,{position:after})}catch(err){await updated('jd_blocks',b.id,{position:before}).catch(()=>{});throw err}await loadBlocks();$('jd99Block').value=b.id;fillBlock();msg('Ordine della pagina aggiornato.')}catch(e){msg('Errore di riordino: '+e.message)}}
$('jd99Up').onclick=()=>move(-1);$('jd99Down').onclick=()=>move(1);
const okImage=url=>typeof url==='string'&&(/^(https:\/\/|assets\/)/).test(url);
async function showPreview(lang){try{await check();const c=chapter();if(!c)throw Error('Seleziona un capitolo.');const view=$('jd99Preview');view.replaceChildren();const h=document.createElement('h4');h.textContent=localized(c,'title',lang);view.append(h);if(localized(c,'subtitle',lang)){const sub=document.createElement('p');sub.textContent=localized(c,'subtitle',lang);view.append(sub)}const ps=await get(db.from('jd_pages').select('id,position').eq('chapter_id',c.id).order('position'));for(const p of ps){const sheet=document.createElement('div');sheet.className='jd99-sheet';const content=await get(db.from('jd_blocks').select('block_type,content,position').eq('page_id',p.id).order('position'));for(const b of content){const val=b.content||{};if(b.block_type==='image'&&okImage(val.url)){const f=document.createElement('figure'),i=document.createElement('img');i.src=val.url;i.alt=localized(val,'caption',lang);f.append(i);if(localized(val,'caption',lang)){const cap=document.createElement('figcaption');cap.textContent=localized(val,'caption',lang);f.append(cap)}sheet.append(f)}else if(b.block_type==='gallery'){for(const x of Array.isArray(val.images)?val.images:[]){if(!okImage(x.url))continue;const i=document.createElement('img');i.src=x.url;i.alt=localized(x,'caption',lang);sheet.append(i)}}else if(['text','quote'].includes(b.block_type)){const t=document.createElement(b.block_type==='quote'?'blockquote':'p');t.textContent=localized(val,'text',lang);sheet.append(t)}else if(b.block_type==='video'&&okImage(val.url)){const v=document.createElement('video');v.src=val.url;v.controls=true;v.style.maxWidth='100%';sheet.append(v)}}view.append(sheet)}view.hidden=false;msg(`Anteprima privata ${lang.toUpperCase()} caricata. Le traduzioni non disponibili rimangono in italiano.`)}catch(e){msg('Errore anteprima: '+e.message)}}
$('jd99PreviewIT').onclick=()=>showPreview('it');$('jd99PreviewEN').onclick=()=>showPreview('en');
async function loadProducts(){await check();products=await get(db.from('jd_products').select('id,title,title_en,description,description_en,status').order('position'));choose('jd99Product',products,p=>`${p.title} · ${p.status==='published'?'pubblicato':'bozza'}`);fillProduct();msg('Prodotti caricati.',true)}
function fillProduct(){const p=product();$('jd99ProductTitleIT').value=p?.title||'';$('jd99ProductTitleEN').value=p?.title_en||'';$('jd99ProductDescIT').value=p?.description||'';$('jd99ProductDescEN').value=p?.description_en||'';}
$('jd99Product').addEventListener('change',fillProduct);$('jd99RefreshProducts').onclick=()=>loadProducts().catch(e=>msg('Errore: '+e.message,true));
$('jd99SaveProduct').onclick=async()=>{try{const p=product();if(!p)throw Error('Seleziona un prodotto.');const title=$('jd99ProductTitleIT').value.trim();if(!title)throw Error('Il nome italiano è obbligatorio.');await updated('jd_products',p.id,{title,title_en:$('jd99ProductTitleEN').value.trim()||null,description:$('jd99ProductDescIT').value.trim(),description_en:$('jd99ProductDescEN').value.trim()||null});await loadProducts();msg('Prodotto salvato in entrambe le lingue.',true)}catch(e){msg('Errore: '+e.message,true)}};
document.querySelector('[data-tab="chapters"]')?.addEventListener('click',()=>loadChapters().catch(e=>msg('Errore: '+e.message)));
document.querySelector('[data-tab="editions"]')?.addEventListener('click',()=>loadProducts().catch(e=>msg('Errore: '+e.message,true)));
$('loginForm')?.addEventListener('submit',()=>{setTimeout(()=>loadChapters().catch(()=>{}),1100)});
if(!$('dashboard').hidden)loadChapters().catch(e=>msg(e.message));
})();
