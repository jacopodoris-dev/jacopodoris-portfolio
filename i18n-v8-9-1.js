/* JD V8.9.1 — Public language switch. Editorial content is never machine-translated. */
(()=>{
 'use strict';
 const saved=(()=>{try{return localStorage.getItem('jd-language')}catch{return null}})();
 const langOf=v=>v==='en'?'en':'it';
 let lang=langOf(new URL(location.href).searchParams.get('lang')||saved);
 const selectors={
  '.opening .opening-copy > .eyebrow':['A VISUAL PRACTICE / MILANO','A VISUAL PRACTICE / MILAN'],
  '.opening h1':['Rallenta<span class="period">.</span>','Slow down<span class="period">.</span>'],
  '.opening-bottom p':['Una visione non si consuma.<br/>Si attraversa.','A vision is not consumed.<br/>It is experienced.'],
  '.opening-bottom a':['ENTRA NEL LIBRO <span></span>','ENTER THE BOOK <span></span>'],
  '.tiny-label span:first-child':['INDEX / 2026','INDEX / 2026'],
  '.tiny-label span:last-child':['ART DIRECTION — VISUAL RESEARCH','ART DIRECTION — VISUAL RESEARCH'],
  '.intro-layout .eyebrow':['01 / EDITORIAL PRACTICE','01 / EDITORIAL PRACTICE'],
  '.intro-layout h2':['Le forme<br/>di uno <em>sguardo.</em>','The forms<br/>of a <em>vision.</em>'],
  '.intro-right p:first-child':['Un archivio aperto di immagini, sistemi visivi e sperimentazioni. Qui ogni progetto prende il tempo necessario per raccontare la propria origine, il processo e la materia che lo rende riconoscibile.','An open archive of images, visual systems and experiments. Each project is given the time and space to reveal its origins, its process and the material that makes it distinct.'],
  '.intro-right .small-muted':['Un progetto digitale di Jacopo Doris, art director con base a Milano.','A digital publication by Jacopo Doris, an art director based in Milan.'],
  '.chapter-heading h2':['Studi<br/>sulla luce<span class="period">.</span>','Studies<br/>in light<span class="period">.</span>'],
  '.chapter-lead p':['La luce non si limita a rendere visibile un oggetto: ne modifica la presenza, misura le distanze, disegna il confine tra ciò che riconosciamo e ciò che rimane sospeso.','Light does more than reveal an object: it changes its presence, measures distance and traces the boundary between what we recognize and what remains suspended.'],
  '.essay p:nth-of-type(1)':['Ogni superficie trattiene una traccia del mondo che la circonda. Il vetro accoglie il paesaggio e lo restituisce trasformato; la trasparenza, apparentemente neutra, diventa un linguaggio capace di rivelare molteplici profondità.','Every surface retains a trace of the world around it. Glass absorbs the landscape and returns it transformed; transparency, seemingly neutral, becomes a language capable of revealing multiple depths.'],
  '.essay p:nth-of-type(2)':['Questa ricerca visiva procede per variazioni minime: spostamenti di luce, mutamenti di scala, attriti fra materiali. La forma non è mai un elemento isolato, ma una relazione in continuo divenire.','This visual research unfolds through subtle variations: shifts of light, changes of scale and encounters between materials. Form is never isolated; it is a relationship in constant evolution.'],
  '.essay small':['TESTO EDITORIALE DI PROPOSTA — DA APPROVARE CON JACOPO','PROPOSED EDITORIAL TEXT — SUBJECT TO JACOPO’S APPROVAL'],
  '.short-quote':['«La materia non contiene soltanto la luce. La interpreta.»','“Matter does not merely contain light. It interprets it.”'],
  '.next-chapter .eyebrow':['CONTINUA A ESPLORARE','CONTINUE EXPLORING'],
  '.next-chapter a':['02 — Stories &amp; Notes <span></span>','02 — Stories &amp; Notes <span></span>'],
  '.film-head h2':['La forma<br/>in movimento.','Form<br/>in motion.'],
  '.film-head p':['Il movimento come estensione della ricerca fotografica. Una sequenza breve, contemplativa, capace di trasformare un singolo dettaglio in un tempo da abitare.','Motion as an extension of photographic research. A brief, contemplative sequence that transforms a single detail into a moment to inhabit.'],
  '.film-caption span:last-child':['VIDEO DI STUDIO — NON PROGETTO DEFINITIVO','STUDY FILM — NOT A FINAL PROJECT'],
  '.stories-section .section-header h2':['Un archivio<br/>di possibilità.','An archive<br/>of possibilities.'],
  '.stories-section .section-header p':['Frammenti, annotazioni, osservazioni. Il racconto visivo non si esaurisce in un’immagine: continua nelle relazioni che quella immagine rende possibili.','Fragments, notes and observations. A visual narrative does not end with an image: it continues through the connections that image makes possible.'],
  '.stack-instructions > span':['PASSA IL CURSORE SULLE IMMAGINI','HOVER OVER THE IMAGES'],
  '.notes-grid article:first-child h3':['Oggetti e memoria','Objects and memory'],
  '.notes-grid article:first-child p':['Un oggetto nasce da una forma, ma acquista senso attraverso la relazione con chi lo osserva.','An object begins as a form but gains meaning through its relationship with the viewer.'],
  '.notes-grid article:last-child h3':['Comporre il silenzio','Composing silence'],
  '.notes-grid article:last-child p':['La pagina non è uno spazio da riempire: è il luogo in cui testo e immagine trovano una distanza necessaria.','A page is not a space to fill: it is where text and image find the distance they need.'],
  '.live-section .section-header h2':['Il libro cresce.','The book evolves.'],
  '.live-section .section-header p':['Questa sezione legge i capitoli pubblicati attraverso JD Studio. Le bozze restano riservate al loro autore.','This section presents chapters published through JD Studio. Drafts remain private to their author.'],
  '.reading-note':['Le pagine illustrative precedenti servono a mostrare la direzione artistica. I capitoli qui sopra, quando presenti, provengono dal database di Supabase.','The preceding sample pages illustrate the artistic direction. The chapters above, when available, are loaded from Supabase.'],
  '.edition-heading p':['Serie limitate, oggetti e superfici che diventano espressioni di un linguaggio visivo.','Limited editions, objects and surfaces as expressions of a visual language.'],
  '.about-grid > div h2':['Jacopo Doris.','Jacopo Doris.'],
  '.about-grid > div p':['Art director e visual designer con base a Milano. Il suo lavoro indaga il rapporto fra identità, forma e racconto attraverso immagini, sistemi editoriali e direzione visiva.','Milan-based art director and visual designer. His practice explores the relationship between identity, form and narrative through imagery, editorial systems and visual direction.'],
  '.about-grid .text-link':['INIZIA UNA CONVERSAZIONE <span></span>','START A CONVERSATION <span></span>'],
  '.nav-studio':['JD STUDIO <span aria-hidden="true"></span>','JD STUDIO <span aria-hidden="true"></span>'],
  '.film-head .eyebrow':['MOVING IMAGE / 001','MOVING IMAGE / 001']
 };
 const navs=[['WORKS','WORK'],['STORIES','STORIES'],['EDITIONS','EDITIONS'],['ABOUT','ABOUT']];
 const cache=new Map();
 function renderFixed(){
   for(const [selector,pair] of Object.entries(selectors)){
     const node=document.querySelector(selector);if(!node)continue;
     const next=pair[lang==='en'?1:0];if(node.dataset.jdTranslated!==lang){node.innerHTML=next;node.dataset.jdTranslated=lang;}
   }
   document.querySelectorAll('.site-nav nav a').forEach((n,i)=>{if(navs[i])n.textContent=navs[i][lang==='en'?1:0]});
   const st=document.querySelector('#stackToggle');if(st)st.textContent=st.textContent.includes('SEPARA')||st.textContent.includes('SEPARATE')?(lang==='en'?'SEPARATE THE PAGES ':'SEPARA LE PAGINE '):(lang==='en'?'GATHER THE PAGES ':'RACCOGLI LE PAGINE ');
   const meter=document.querySelector('#liveStatus');if(meter){const m=meter.textContent.match(/^(\d+) (?:capitolo pubblicato|capitoli pubblicati|published chapters?)/);if(m)meter.textContent=lang==='en'?`${m[1]} published ${m[1]==='1'?'chapter':'chapters'} in the book.`:`${m[1]} ${m[1]==='1'?'capitolo pubblicato':'capitoli pubblicati'} nel libro.`}
   document.querySelectorAll('.published-card > .eyebrow').forEach(n=>n.textContent=lang==='en'?'FROM THE EDITORIAL ARCHIVE':'DALL’ARCHIVIO EDITORIALE');
   document.querySelectorAll('.jd-cart-top').forEach(n=>{const count=n.textContent.match(/\d+/)?.[0]||'0';n.textContent=(lang==='en'?'CART / ':'CARRELLO / ')+count});
   const labels={'Il tuo carrello.':'Your selection.','Chiudi ×':'Close ×','Totale provvisorio':'Estimated total','Acquisto non ancora attivo':'Checkout not yet available','Nessuna creazione selezionata.':'No pieces selected.','Rimuovi':'Remove','Aggiungi al carrello ':'Add to selection ','Selezione dimostrativa. Prezzi e disponibilità sono indicativi fino alla verifica del catalogo. Nessun ordine viene inviato e nessun pagamento viene addebitato.':'Demonstration cart only. Prices and availability are indicative until catalog verification. No order is placed and no payment is charged.'};
   for(const n of document.querySelectorAll('.jd-cart-drawer button,.jd-cart-drawer h2,.jd-cart-drawer .jd-cart-note,.jd-cart-drawer .jd-cart-total span,.jd-cart-list p,.jd-cart-trigger')){
     const original=cache.get(n)||Object.keys(labels).find(k=>n.textContent.trim()===k)||Object.keys(labels).find(k=>n.textContent.trim()===labels[k]);
     if(!original)continue;cache.set(n,original);const next=lang==='en'?labels[original]:original;if(n.textContent!==next)n.textContent=next;
   }
   document.querySelectorAll('.edition-product-meta span').forEach(n=>{n.textContent=n.textContent.replace(lang==='en'?/pezzi disponibili|pezzo disponibile/g:/pieces available|piece available/g,lang==='en'?'pieces available':'pezzi disponibili')});
   document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
   document.documentElement.lang=lang;
 }
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;renderFixed()})}
 document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{lang=langOf(button.dataset.lang);try{localStorage.setItem('jd-language',lang)}catch{}renderFixed();window.dispatchEvent(new CustomEvent('jd:languagechange',{detail:{language:lang}}))}));
 const obs=new MutationObserver(schedule);obs.observe(document.body,{subtree:true,childList:true,characterData:true});
 renderFixed();
})();