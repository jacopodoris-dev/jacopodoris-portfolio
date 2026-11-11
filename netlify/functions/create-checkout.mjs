/* JD Editions V8.9.6 — Stripe TEST checkout. This endpoint deliberately refuses live keys.
   It never accepts monetary amounts, titles, or URLs from the browser. */
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});
const config = key => (process.env[key] || '').trim();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(request) {
  if (request.method !== 'POST') return json({error:'Metodo non consentito.'},405);
  const origin = config('JD_CHECKOUT_ORIGIN').replace(/\/$/,'');
  const stripeKey=config('STRIPE_SECRET_KEY');
  const shippingRate=config('STRIPE_SHIPPING_RATE_ID');
  const supabaseUrl=config('JD_SUPABASE_URL').replace(/\/$/,'');
  const supabaseKey=config('JD_SUPABASE_PUBLIC_KEY');
  if (!origin || !origin.startsWith('https://') || !stripeKey.startsWith('sk_test_') || !shippingRate.startsWith('shr_') || !supabaseUrl.startsWith('https://') || !supabaseKey) {
    return json({error:'Checkout di prova non configurato. Verificare le variabili Netlify (chiavi TEST).'},503);
  }
  if (request.headers.get('origin') !== origin) return json({error:'Origine non autorizzata.'},403);
  const size = Number(request.headers.get('content-length') || 0);
  if (size>4000) return json({error:'Carrello troppo grande.'},413);
  let payload;
  try { payload=await request.json(); } catch {return json({error:'Carrello non valido.'},400)}
  const entries=payload?.items;
  if (!Array.isArray(entries) || !entries.length || entries.length>10) return json({error:'Seleziona da 1 a 10 prodotti.'},400);
  if (entries.some(x=>!x || !uuid.test(x.id) || !Number.isSafeInteger(x.qty) || x.qty<1 || x.qty>10)) return json({error:'Quantità o prodotti non validi.'},400);
  const ids=entries.map(x=>x.id);
  if (new Set(ids).size!==ids.length) return json({error:'Prodotti duplicati nel carrello.'},400);
  const headers={'apikey':supabaseKey,'authorization':`Bearer ${supabaseKey}`};
  try {
    const productUrl=new URL(`${supabaseUrl}/rest/v1/jd_products`);
    productUrl.searchParams.set('select','id,title,title_en,description,description_en,price_eur,stock,status,category_id');
    productUrl.searchParams.set('id',`in.(${ids.join(',')})`);
    productUrl.searchParams.set('status','eq.published');
    const res=await fetch(productUrl,{headers});
    if(!res.ok)throw new Error('Catalogo non disponibile');
    const products=await res.json();
    const byId=new Map(products.map(x=>[x.id,x]));
    if(byId.size!==ids.length)return json({error:'Alcuni prodotti non sono più disponibili.'},409);
    const catIds=[...new Set(products.map(p=>p.category_id))];
    const catUrl=new URL(`${supabaseUrl}/rest/v1/jd_categories`);
    catUrl.searchParams.set('select','id');catUrl.searchParams.set('id',`in.(${catIds.join(',')})`);catUrl.searchParams.set('status','eq.published');
    const catsRes=await fetch(catUrl,{headers});if(!catsRes.ok)throw new Error('Categorie non disponibili');
    const approved=new Set((await catsRes.json()).map(c=>c.id));
    const lang=payload.language==='en'?'en':'it';
    const form=new URLSearchParams();
    form.set('mode','payment');
    form.set('locale',lang);
    form.set('success_url',`${origin}/checkout-result.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
    form.set('cancel_url',`${origin}/checkout-result.html?checkout=cancel`);
    form.set('shipping_address_collection[allowed_countries][0]','IT');
    form.set('shipping_options[0][shipping_rate]',shippingRate);
    form.set('billing_address_collection','required');
    form.set('phone_number_collection[enabled]','true');
    form.set('metadata[source]','jd-editions-v8.9.6-test');
    entries.forEach((entry,i)=>{
      const p=byId.get(entry.id);
      const euros=Number(p.price_eur);
      const cents=Math.round(euros*100);
      if(!approved.has(p.category_id) || !Number.isFinite(euros) || cents<50 || cents>100000000 || Math.abs(cents/100-euros)>0.00001 || Number(p.stock)<entry.qty){throw new Error('Prodotto, prezzo o quantità non più disponibili.');}
      form.set(`line_items[${i}][price_data][currency]`,'eur');
      form.set(`line_items[${i}][price_data][unit_amount]`,String(cents));
      form.set(`line_items[${i}][price_data][product_data][name]`,String((lang==='en' && p.title_en)||p.title).slice(0,200));
      form.set(`line_items[${i}][quantity]`,String(entry.qty));
      form.set(`line_items[${i}][price_data][product_data][metadata][jd_product_id]`,p.id);
    });
    const stripe=await fetch('https://api.stripe.com/v1/checkout/sessions',{
      method:'POST',headers:{authorization:`Bearer ${stripeKey}`,'content-type':'application/x-www-form-urlencoded'},body:form.toString()
    });
    const session=await stripe.json();
    if(!stripe.ok || !session.url || !session.url.startsWith('https://checkout.stripe.com/')){
      console.error('Stripe checkout error',stripe.status,session?.error?.code||'unknown');
      return json({error:'Stripe non ha creato il checkout. Verifica tariffa di spedizione e chiavi test.'},502);
    }
    return json({url:session.url});
  } catch (e) {console.error('JD test checkout:',e.message);return json({error:'Impossibile procedere: '+e.message},409)}
}
