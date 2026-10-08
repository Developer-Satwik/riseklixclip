import {createEnquiryHandler} from '../../server/campaign-enquiry.mjs';
const names=['RESEND_API_KEY','RESEND_FROM_EMAIL','CAMPAIGN_TO_EMAIL','CAMPAIGN_ALLOWED_ORIGINS'];
const env=Object.fromEntries(names.map(name=>[name,globalThis.Netlify?.env?.get(name)||process.env[name]]));
const handle=createEnquiryHandler({env});
export default (request,context)=>handle(request,{clientAddress:context?.ip||'unknown'});
