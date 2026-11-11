(()=>{
'use strict';
const $=id=>document.getElementById(id),msg=s=>{const n=$('trMessage');if(n)n.textContent=s};
const owner='feb9c40c-75ff-41fc-a92d-47f670d5d0ce';
if(!window.supabase||!window.JD_SUPABASE_URL||!window.JD_SUPABASE_ANON_KEY)return;
const db=window.supabase.createClient(window.JD_SUPABASE_URL,window.JD_SUPABASE_ANON_KEY);
let chapters=[],blocks=[],cats=[],products=[];
const select=(id,items,name)=>{const el=$(id),old=el.value;el.replaceChildren();for(const item of items){const opt=document.createElement('option');opt.value=item.id;opt.textContent=name(item);el.append(opt)}if(items.some(x=>x.id===old))el.value=old};
const chosen=(id,arr)=>arr.find(x=>x.id===$(id).value);
async function authorized(){const {data:{user},error}=await db.auth.getUser();if(error||user?.id!==owner)throw Error('Effettua l’accesso con l’account editoriale di Jacopo.')}
async function read(table,query){const {data,error}=await query;if(error)throw Error(table+': '+error.message);return data||[]}
function fillChapter(){const c=chosen('trChapter',chapters);$('trChapterIT').value=c?.title||'';$('trChapterEN').value=c?.title_en||'';$('trChapterSubIT').value=c?.subtitle||'';$('trChapterSubEN').value=c?.subtitle_en||''}
function fillBlock(){const b=chosen('trBlock',blocks),c=b?.content||{};const key=b?.block_type==='image'?'caption':'text';$('trBlockIT').value=c[key]||'';$('trBlockEN').value=c[key+'_en']||''}
async function readBlocks(){blocks=[];const cid=$('trBlockChapter').value;if(!cid){select('trBlock',[],()=>'-');fillBlock();return}const pages=await read('Pagine',db.from('jd_pages').select('id,position').eq('chapter_id',cid).order('position'));for(const page of pages){const bs=await read('Blocchi',db.from('jd_blocks').select('id,block_type,content,position').eq('page_id',page.id).order('position'));for(const b of bs){if(['text','quote','image'].includes(b.block_type))blocks.push({...b,page:page.position})}}select('trBlock',blocks,b=>`Pagina ${b.page} · ${b.block_type} · ${String(b.content?.text||b.content?.caption||'').slice(0,50)}`);fillBlock()}
function fillCategory(){const c=chosen('trCategory',cats);$('trCategoryEN').value=c?.name_en||'';$('trCategoryDescEN').value=c?.description_en||''}
function fillProduct(){const c=chosen('trProduct',products);$('trProductEN').value=c?.title_en||'';$('trProductDescEN').value=c?.description_en||''}
async function refresh(){await authorized();chapters=await read('Capitoli',db.from('jd_chapters').select('id,title,subtitle,title_en,subtitle_en').order('position'));cats=await read('Categorie',db.from('jd_categories').select('id,name,name_en,description_en').order('position'));products=await read('Prodotti',db.from('jd_products').select('id,title,title_en,description_en').order('position'));
select('trChapter',chapters,c=>c.title);select('trBlockChapter',chapters,c=>c.title);select('trCategory',cats,c=>c.name);select('trProduct',products,c=>c.title);fillChapter();fillCategory();fillProduct();await readBlocks();msg('Le traduzioni sono pronte per la modifica.')}
async function save(table,id,data){if(!id){msg('Seleziona prima un elemento.');return}await authorized();const {error}=await db.from(table).update(data).eq('id',id);if(error)throw Error(error.message);msg('Traduzione salvata su Supabase. Aggiorna l’anteprima pubblica e scegli EN.')}
$('trChapter').addEventListener('change',fillChapter);$('trBlockChapter').addEventListener('change',()=>readBlocks().catch(e=>msg(e.message)));$('trBlock').addEventListener('change',fillBlock);$('trCategory').addEventListener('change',fillCategory);$('trProduct').addEventListener('change',fillProduct);
$('trSaveChapter').onclick=async()=>{try{await save('jd_chapters',$('trChapter').value,{title_en:$('trChapterEN').value.trim()||null,subtitle_en:$('trChapterSubEN').value.trim()||null});await refresh()}catch(e){msg(e.message)}};
$('trSaveBlock').onclick=async()=>{try{const b=chosen('trBlock',blocks);if(!b)return;const key=b.block_type==='image'?'caption':'text';await save('jd_blocks',b.id,{content:{...b.content,[key+'_en']:$('trBlockEN').value.trim()}});await readBlocks()}catch(e){msg(e.message)}};
$('trSaveCategory').onclick=async()=>{try{await save('jd_categories',$('trCategory').value,{name_en:$('trCategoryEN').value.trim()||null,description_en:$('trCategoryDescEN').value.trim()||null});await refresh()}catch(e){msg(e.message)}};
$('trSaveProduct').onclick=async()=>{try{await save('jd_products',$('trProduct').value,{title_en:$('trProductEN').value.trim()||null,description_en:$('trProductDescEN').value.trim()||null});await refresh()}catch(e){msg(e.message)}};
let active=false;document.querySelector('[data-tab="translations"]')?.addEventListener('click',async()=>{try{await refresh();active=true}catch(e){msg(e.message)}});
})();
