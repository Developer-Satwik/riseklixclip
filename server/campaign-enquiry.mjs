import {createHash} from 'node:crypto';
const LIMIT=98304,WINDOW=600000;
const fields={name:['Your name',80],email:['Email to reply to',254],goal:['Campaign idea',4000],sourceUrl:['Content or project link',2048],budget:['Budget',120],audience:['Audience or language',200],timing:['Start date',80]};
const emailPattern=/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=value=>createHash('sha256').update(value).digest('hex');
export function validateEnquiry(raw){
 const errors={},values={};
 for(const [name,[label,max]] of Object.entries(fields)){
  const value=raw[name];values[name]=typeof value==='string'?value.trim():'';
  if(value!=null&&typeof value!=='string')errors[name]=`Enter ${label.toLowerCase()} as text.`;
  else if(values[name].length>max)errors[name]=`Keep ${label.toLowerCase()} to ${max} characters or fewer.`;
  else if(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(values[name])||(name!=='goal'&&/[\r\n]/.test(values[name])))errors[name]=`Remove invalid characters from ${label.toLowerCase()}.`;
 }
 if(!values.name)errors.name='Enter your name.';
 if(!values.email||!emailPattern.test(values.email))errors.email='Enter a valid email address, such as name@example.com.';
 if(!values.goal)errors.goal='Tell us what you would like to promote.';
 if(values.sourceUrl)try{const url=new URL(values.sourceUrl);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error();}catch{errors.sourceUrl='Enter a public link starting with https:// or http://.';}
 return {values,errors};
}
function receipt(data,status,raw){
 const success=data.state==='accepted';
 const values=Object.fromEntries(Object.keys(fields).map(name=>[name,typeof raw?.[name]==='string'?raw[name].slice(0,fields[name][1]+1):'']));
 const errors=data.errors||{},controls=Object.entries(fields).map(([name,[label,max]])=>{
  const required=['name','email','goal'].includes(name),id=`receipt-${name}`,error=errors[name];
  return `<div class="enquiry-field"><label for="${id}">${label}${required?'':' (optional)'}</label>${name==='goal'?`<textarea id="${id}" name="${name}" rows="5" maxlength="${max}" required${error?' aria-invalid="true"':''}>${escape(values[name])}</textarea>`:`<input id="${id}" name="${name}" type="${name==='email'?'email':name==='sourceUrl'?'url':'text'}" maxlength="${max}" value="${escape(values[name])}"${required?' required':''}${error?' aria-invalid="true"':''}${name==='name'||name==='email'?` autocomplete="${name}"`:''}>`}${error?`<p class="receipt-errors">${escape(error)}</p>`:''}</div>`;
 }).join('');
 const errorsList=Object.entries(errors).map(([name,error])=>`<li><a href="#receipt-${escape(name)}">${escape(error)}</a></li>`).join('');
 return `<!doctype html><html lang="en-IN" data-theme="system"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${success?'Enquiry submitted':'Enquiry needs attention'} | RiseKlix</title><link rel="icon" href="/assets/riseklix-icon-32.png" type="image/png" sizes="32x32"><link rel="icon" href="/assets/riseklix-icon-48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/assets/riseklix-icon-180.png" sizes="180x180"><link rel="stylesheet" href="/styles.css?v=official-logo-1"><link rel="stylesheet" href="/contact.css"></head><body><main class="enquiry-receipt"><a href="/contact/">← Campaign enquiries</a><a class="brand receipt-brand" href="/" aria-label="Clip by RiseKlix home"><img class="brand-mark" src="/assets/riseklix-mark.png" width="96" height="128" alt="" decoding="async"><span>clip<span class="brand-by">by RiseKlix</span></span></a><h1>${success?'Your enquiry has been submitted.':'Your enquiry needs attention.'}</h1><p>${escape(data.message)}</p>${success?`<p class="small">Reference: ${escape(data.id)}</p><p>The team can reply to the email you provided. This does not yet confirm email delivery or a campaign booking.</p><p><a href="/guides/creator-clipping-campaign-guide-india.html">Read the campaign guide ↗</a></p>`:`${errorsList?`<ul class="receipt-errors">${errorsList}</ul>`:''}<p>Your answers are below. You can edit them and try again, or copy them into an email to <a href="mailto:contact@riseklix.com">contact@riseklix.com</a>.</p><form action="/api/campaign-enquiry" method="post">${controls}<input name="requestId" type="hidden" value="${escape(typeof raw?.requestId==='string'?raw.requestId:'')}"><button class="button primary" type="submit">Try sending again ↗</button></form>`}<p><a href="https://discord.gg/skQk3xZcRa">Open RiseKlix Discord ↗</a> · <a href="/privacy/#campaign-enquiries">Enquiry privacy</a></p></main></body></html>`;
}
export function createEnquiryHandler({env=process.env,fetchImpl=fetch,now=Date.now}={}){
 // This bounded limiter is per process/function instance, not a distributed anti-bot service.
 const attempts=new Map();
 return async function handle(request,{clientAddress='unknown'}={}){
  const json=(request.headers.get('content-type')||'').split(';')[0].trim()==='application/json';let raw;
  function respond(status,data,headers={}){return new Response(json?JSON.stringify(data):receipt(data,status,raw),{status,headers:{'Content-Type':json?'application/json; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer',...headers}});}
  if(request.method!=='POST')return respond(405,{message:'Use the campaign form to send an enquiry.'},{Allow:'POST'});
  const allowed=new Set(['http://127.0.0.1:8770','http://localhost:8770','https://clip.riseklix.com',...(env.CAMPAIGN_ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean)]);
  const origin=request.headers.get('origin');
  if((origin&&!allowed.has(origin))||request.headers.get('sec-fetch-site')==='cross-site')return respond(403,{message:'Open the campaign page on RiseKlix to send your enquiry.'});
  const contentType=(request.headers.get('content-type')||'').split(';')[0].trim();
  if(!['application/json','application/x-www-form-urlencoded'].includes(contentType))return respond(415,{message:'Use the campaign form to send an enquiry.'});
  if(Number(request.headers.get('content-length'))>LIMIT)return respond(413,{message:'Your enquiry is too large. Please shorten it and try again.'});
  try{
   const reader=request.body?.getReader();let length=0,chunks=[];
   if(reader)while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>LIMIT){await reader.cancel();return respond(413,{message:'Your enquiry is too large. Please shorten it and try again.'});}chunks.push(value);}
   const body=Buffer.concat(chunks).toString('utf8');raw=json?JSON.parse(body):Object.fromEntries(new URLSearchParams(body));
   if(!raw||Array.isArray(raw)||typeof raw!=='object')throw Error();
  }catch{return respond(400,{message:'We could not read the enquiry. Please use the campaign form and try again.'});}
  if(raw.website)return respond(400,{message:'This enquiry could not be submitted. Please contact the team directly.'});
  const {values,errors}=validateEnquiry(raw);
  if(Object.keys(errors).length)return respond(422,{message:'Check the highlighted details. Your answers have been kept.',errors});
  const at=now();for(const [key,value] of attempts)if(at-value.start>=WINDOW)attempts.delete(key);
  const address=String(clientAddress).slice(0,128),key=hash(address),entry=attempts.get(key)||{start:at,count:0};
  if(entry.count>=5)return respond(429,{message:'Too many enquiries from this connection. Wait a few minutes or contact the team by email.'},{'Retry-After':String(Math.ceil((WINDOW-(at-entry.start))/1000))});
  if(attempts.size>=5000&&!attempts.has(key))return respond(429,{message:'Enquiry submission is busy. Please try again later or contact the team by email.'},{'Retry-After':'600'});
  entry.count++;attempts.set(key,entry);
  const apiKey=env.RESEND_API_KEY,from=env.RESEND_FROM_EMAIL||'contact@riseklix.com',to=env.CAMPAIGN_TO_EMAIL||'contact@riseklix.com';
  if(!apiKey||!emailPattern.test(from)||!emailPattern.test(to))return respond(503,{state:'unavailable',message:'Email submission is currently unavailable. Your answers are still here; copy them and email contact@riseklix.com, or use Discord.'});
  const text='RISEKLIX — CAMPAIGN ENQUIRY\n\n'+Object.entries(fields).map(([name,[label]])=>`${label}:\n${values[name]||'Not provided'}`).join('\n\n');
  const html='<h1>RiseKlix campaign enquiry</h1>'+Object.entries(fields).map(([name,[label]])=>`<h2>${label}</h2><p style="white-space:pre-wrap">${escape(values[name]||'Not provided')}</p>`).join('');
  const payload={from:`RiseKlix enquiries <${from}>`,to:[to],reply_to:values.email,subject:'New clipping campaign enquiry — RiseKlix',text,html};
  const fingerprint=hash(JSON.stringify(payload)),requestId=typeof raw.requestId==='string'&&/^[a-zA-Z0-9_-]{8,80}$/.test(raw.requestId)?raw.requestId:'form';
  try{
   const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':`campaign/${requestId}/${fingerprint}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});
   const data=await response.json().catch(()=>null);
   if(response.ok&&typeof data?.id==='string'&&/^[a-zA-Z0-9_-]{8,128}$/.test(data.id))return respond(202,{state:'accepted',id:data.id,message:'Your enquiry was accepted for sending to the RiseKlix team.'});
  }catch{/* The provider may have accepted a request before a timeout. Keep the retry key. */}
  return respond(503,{state:'unconfirmed',message:'We could not confirm your submission. Your answers are still here. Try again, or copy your enquiry and email contact@riseklix.com.'});
 };
}
