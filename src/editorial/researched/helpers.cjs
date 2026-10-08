const base=require('../helpers.cjs');
const sources={...base.sources,
 indiaInternet:['IAMAI and Kantar: Internet in India 2024','https://www.iamai.in/sites/default/files/research/Kantar_%20IAMAI%20report_2024_.pdf'],
 indiaCreators:['BCG: From Content to Commerce, May 2025','https://www.bcg.com/publications/2025/india-from-content-to-commerce-mapping-indias-creator-economy'],
 copyrightWorks:['Copyright Office: Act, Chapter III, protected works and rights','https://copyright.gov.in/Copyright_Act_1957/chapter_iii.html'],
 copyrightLicence:['Copyright Office: Act, Chapter VI, licences','https://copyright.gov.in/Copyright_Act_1957/chapter_vi.html'],
 copyrightExceptions:['Copyright Office: Act, Chapter XI, infringement and exceptions','https://copyright.gov.in/Copyright_Act_1957/chapter_xi.html'],
 youtubeReuse:['YouTube: channel monetisation and reused-content policies','https://support.google.com/youtube/answer/1311392?hl=en'],
 youtubeClaims:['YouTube: Content ID claims','https://support.google.com/youtube/answer/6013276?hl=en'],
 youtubeCopyright:['YouTube: copyright on YouTube','https://support.google.com/youtube/answer/2797466?hl=en'],
 gaUTM:['Google Analytics: campaign URL parameters','https://support.google.com/analytics/answer/10917952?hl=en'],
 gaScope:['Google Analytics: traffic-source dimension scopes','https://support.google.com/analytics/answer/11080067?hl=en'],
 gaPII:['Google Analytics: avoid collecting personally identifiable information','https://support.google.com/analytics/answer/6366371?hl=en'],
 waiCaptions:['W3C WAI: captions and subtitles','https://www.w3.org/WAI/media/av/captions/'],
 wcagCaptions:['W3C: understanding prerecorded captions, SC 1.2.2','https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html'],
 waiDescription:['W3C WAI: description of visual information','https://www.w3.org/WAI/media/av/description/'],
 cyberReport:['Ministry of Home Affairs: cybercrime reporting, 11 March 2026','https://www.mha.gov.in/MHA1/Par2017/pdfs/par2026-pdfs/RS11032026/2161.pdf'],
 opus:['OpusClip: official AI editing product description','https://www.opus.pro/'],
 googleAIReports:['Google: Search Generative AI performance reports','https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports'],
 bingAI:['Bing: AI Performance reporting and limitations','https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c'],
 fbOriginal:['Meta: Facebook original-content guidance, March 2026','https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/'],
 metaRecommendations:['Meta: recommendation guidelines and permitted content','https://about.fb.com/news/2020/08/recommendation-guidelines/'],
 instagramTrials:['Meta: Instagram trial reels, June 2025','https://about.fb.com/news/2025/06/inspiring-creativity-that-brings-people-together/'],
 twitchClips:['Twitch: create, edit and share clips','https://help.twitch.tv/s/article/how-to-use-clips'],
 twitchSettings:['Twitch: streamer clip settings and sharing controls','https://help.twitch.tv/s/article/clips-settings'],
 youtubeRelated:['YouTube: add a related video to Shorts','https://support.google.com/youtube/answer/14075157?hl=en'],
 youtubeIdentity:['YouTube: impersonation and fan-channel identity','https://support.google.com/youtube/answer/2801947?hl=en'],
 shopifyAttribution:['Shopify: marketing reports and attribution models','https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/marketing-reports'],
 shopifyDiscounts:['Shopify: sales reports and discount-code reporting','https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report'],
 clipsterAppeals:['Clipster: campaign rejection appeals, updated October 2026','https://www.clipster.gg/help-centre/reviews-appeals-and-suspensions/how-do-i-appeal-a-rejected-clip'],
 clippingSubmission:['Clipping.net: campaign details and submission conditions','https://clipping.net/docs/clippers/campaign-detail'],
 pageExperience:['Google Search: page-experience guidance','https://developers.google.com/search/docs/appearance/page-experience'],
 waiForms:['W3C WAI: labels and instructions for forms','https://www.w3.org/WAI/tutorials/forms/labels/']
};
function sec(heading,text,points=[],options={}){
 return {...base.sec(heading,text,points,{...options,sources:[]}),sources:options.sources||[],references:(options.sources||[]).map(key=>{if(!sources[key])throw Error('Unknown research source '+key);return sources[key]})};
}
function create(slug,data){
 for(const field of ['title','dek','description','answer','intent','section'])if(!data[field])throw Error('Missing researched article '+field+': '+slug);
 return {slug,category:{blog:'Journal',guides:'Guides',platforms:'Platforms',compare:'Compare'}[data.section],...data,expanded:true,researchedArticle:true,createdDate:'2026-10-07',researchDate:'2026-10-07',references:Array.from(new Map(data.sections.flatMap(s=>s.references||[]).map(ref=>[ref[1],ref])).values()),table:null};
}
module.exports={create,sec,table:base.table,link:base.link,sources};
