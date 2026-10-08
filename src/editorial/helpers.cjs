// Every article is authored separately. These helpers only normalise formatting.
const sources={
 capcut:['CapCut: official editor information','https://www.capcut.com/tools/video-editor-download'],
 asciCode:['ASCI: current code and influencer guidelines','https://www.ascionline.in/the-asci-code-guidelines/'],
 asciTool:['ASCI: disclosure planning tool','https://www.ascionline.in/social/tools/'],
 tiktokIndia:['PIB: 29 June 2020 app-blocking announcement','https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1635206&lang=2&reg=3'],
 instagram:['Meta: Instagram insights documentation','https://developers.facebook.com/docs/instagram-platform/insights'],
 instagramMedia:['Meta: Instagram media insights reference','https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/'],
 linkedin:['LinkedIn: video analytics','https://www.linkedin.com/help/linkedin/answer/a590236'],
 youtubePaid:['YouTube: paid promotions','https://support.google.com/youtube/answer/154235?hl=en'],
 clipping:['Clipping.net: official campaign workflow','https://clipping.net/'],
 whop:['Whop: Content Rewards','https://whop.com/blog/content-rewards/'],
 vyro:['Vyro: official campaigns and FAQ','https://vyro.com/'],
 clouted:['MakeClout: current Clouted program','https://makeclout.com/'],
 clipconnect:['ClipConnect: official marketplace','https://clipconnect.in/'],
 youtubeStart:['YouTube: Shorts creation and view-count definitions','https://support.google.com/youtube/answer/10059070?hl=en'],
 youtubeLength:['YouTube: three-minute Shorts and claimed content','https://support.google.com/youtube/answer/15424877?hl=en'],
 youtubeAnalytics:['YouTube: Shorts analytics','https://support.google.com/youtube/answer/12942217?co=YOUTUBE._YTVideoType%3Dshorts&hl=en'],
 xViews:['X: post view counts','https://help.x.com/en/using-x/view-counts'],
 xVideo:['X: Media Studio video analytics','https://help.x.com/en/using-x/media-studio-analytics'],
 discordRoles:['Discord: roles and permissions','https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ'],
 discordChannels:['Discord: channel permissions','https://support.discord.com/hc/en-us/articles/10543994968087-Channel-Permissions-Settings-101'],
 discordRules:['Discord: rules screening','https://support.discord.com/hc/en-us/articles/1500000466882-Rules-Screening-FAQ'],
 asci:['ASCI: influencer advertising guidelines','https://www.ascionline.in/social/wp-content/uploads/2025/04/ASCI-Influencer-Guidelines.pdf'],
 asciFinance:['ASCI: health and finance advertising update','https://www.ascionline.in/wp-content/uploads/2023/08/Health-and-Finance-Guidelines-Update-Press-Release.pdf'],
 npci:['NPCI: UPI fraud awareness','https://www.npci.org.in/fraud-awareness'],
 resolve:['Blackmagic Design: DaVinci Resolve','https://www.blackmagicdesign.com/products/davinciresolve'],
 premiere:['Adobe: Premiere','https://www.adobe.com/products/premiere.html'],
 vn:['VN: official editor information','https://www.vlognow.me/'],
 googleHelpful:['Google Search: helpful, reliable content','https://developers.google.com/search/docs/fundamentals/creating-helpful-content'],
 googleAI:['Google Search: generative AI optimization guidance','https://developers.google.com/search/docs/fundamentals/ai-optimization-guide']
};
const sec=(heading,text,points=[],options={})=>({heading,paragraphs:text.trim().split(/\n\s*\n/).filter(Boolean),points,...options,references:(options.sources||[]).map(key=>{if(!sources[key])throw Error('Unknown source '+key);return sources[key]})});
const table=(headers,rows)=>({headers,rows});
const link=(slug,label)=>({slug,label});
const article=(slug,data)=>[slug,{...data,expanded:true}];
module.exports={sec,table,link,article,sources};
