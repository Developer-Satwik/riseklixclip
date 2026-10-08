// Formatting only: every guide and example is individually authored.
const base=require('../helpers.cjs');
const sources={...base.sources,
 youtubeContent:['YouTube: content performance and Shorts metric definitions','https://support.google.com/youtube/answer/12220281?hl=en'],
 youtubeRelated:['YouTube: related videos in Shorts','https://support.google.com/youtube/answer/14075157?hl=en'],
 youtubePaid:['YouTube: branded-content restrictions and disclosure','https://support.google.com/youtube/answer/154235?hl=en'],
 asci:['ASCI: influencer advertising guidelines','https://www.ascionline.in/social/wp-content/uploads/2025/04/ASCI-Influencer-Guidelines.pdf'],
 gaLeads:['Google Analytics: recommended lead-generation and qualification events','https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead'],
 gaPII:['Google Analytics: avoiding personally identifiable information','https://support.google.com/analytics/answer/6366371?hl=en'],
 businessPerformance:['Google Business Profile: performance and interaction definitions','https://support.google.com/business/answer/9918094?hl=en'],
 businessMenu:['Google Business Profile: managing a food-business menu','https://support.google.com/business/answer/9455840?hl=en'],
 businessDetails:['Google Business Profile: editing business details and hours','https://support.google.com/business/answer/3039617?hl=en'],
 reraAct:['India Code: Real Estate (Regulation and Development) Act, 2016, consolidated to 15 May 2026','https://www.indiacode.nic.in/indiacode/bitstream/123456789/2158/1/A201616.pdf'],
 mahaAgents:['MahaRERA: guidance for agents in Maharashtra','https://www.maharera.maharashtra.gov.in/guidance-for-agents'],
 merchantSize:['Google Merchant Center: size information and product variants','https://support.google.com/merchants/answer/6324492?hl=en'],
 merchantColor:['Google Merchant Center: color and landing-page consistency','https://support.google.com/merchants/answer/6324487?hl=en']
};
function sec(heading,text,points=[],options={}){
 return {...base.sec(heading,text,points,{...options,sources:[]}),sources:options.sources||[],references:(options.sources||[]).map(key=>{if(!sources[key])throw Error('Unknown audience-guide source '+key);return sources[key]})};
}
function create(slug,data){
 const article=base.create(slug,data);
 return {...article,createdDate:'2026-10-08',researchDate:'2026-10-08',modifiedDate:'2026-10-08',researchBatch:3,editorialMethod:'AI-assisted editorial guide, researched against the primary sources linked beside the relevant facts. Examples and planning figures are hypothetical, not RiseKlix client results. Source checks: 8 October 2026.'};
}
module.exports={create,sec,table:base.table,link:base.link,sources};
