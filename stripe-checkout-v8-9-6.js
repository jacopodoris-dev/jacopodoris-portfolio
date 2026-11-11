/* JD V8.9.6 — redirect only to server-created Stripe TEST Checkout. */
(()=>{
'use strict';
const cartKey='jd-editions-cart-v8-9';
const checkout=document.querySelector('.jd-cart-checkout');
if(!checkout)return;
let busy=false;
const label=()=>{let en=false;try{en=localStorage.getItem('jd-language')==='en'}catch{}return en?'Continue to Stripe TEST':'Continua su Stripe TEST'};
checkout.disabled=false;
checkout.textContent=label();
const error=document.createElement('p');error.className='jd-checkout-feedback';error.setAttribute('role','status');error.style.cssText='font-size:13px;line-height:1.5;margin:12px 0;color:#8b4439';checkout.before(error);
checkout.addEventListener('click',async()=>{
  if(busy)return;
  let cart={};try{cart=JSON.parse(localStorage.getItem(cartKey)||'{}')||{}}catch{}
  const items=Object.entries(cart).map(([id,value])=>({id,qty:Number(value?.qty)})).filter(x=>x.qty>0);
  if(!items.length){error.textContent='Carrello vuoto / Empty cart.';return}
  busy=true;checkout.disabled=true;error.textContent='';checkout.textContent='Stripe TEST…';
  try{
    const language=localStorage.getItem('jd-language')==='en'?'en':'it';
    const response=await fetch('/.netlify/functions/create-checkout',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,language})
    });
    const data=await response.json();
    if(!response.ok || !data.url || !/^https:\/\/checkout\.stripe\.com\//.test(data.url))throw Error(data.error||'Checkout non disponibile');
    window.location.assign(data.url);
  }catch(e){error.textContent=e.message;busy=false;checkout.disabled=false;checkout.textContent=label()}
});
window.addEventListener('jd:languagechange',()=>{if(!busy)checkout.textContent=label()});
})();
