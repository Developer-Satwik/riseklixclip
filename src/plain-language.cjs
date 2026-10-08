// Keep necessary technical terms, with plain explanations beside the article.
const terms=[
 ['Eligible views',/\beligible(?: campaign)? views\b/i,'Views that qualify under the campaign’s written payment rules. They may differ from the public view count.'],
 ['Attribution',/\battribut(?:ion|ed|able)\b|\butm\b/i,'A method of connecting a visit, enquiry or order to a campaign. It can miss activity or overlap with other methods; a connection does not prove the campaign caused the result.'],
 ['ROI',/\bROI\b/i,'Return on investment: revenue connected to the campaign minus its full cost, divided by that cost. The revenue method needs checking separately.'],
 ['Disclosure',/\bdisclosure\b/i,'A clear label telling viewers about an advertising or paid relationship where required. It does not replace permission to use the content.'],
 ['Payment cap',/\b(?:payment|reward|gross|budget) cap\b|\bcaps\b/i,'An agreed limit on spending or rewards. Check what the limit applies to and what happens when it is reached.'],
 ['Hook',/\bhooks?\b/i,'The opening that gives someone a reason to keep watching. It should match what the clip actually delivers.'],
 ['Source content',/\bsource(?:s| content| video| footage| material| rights| permission)?\b/i,'The original video, recording or other material used to make the clip. Check permission, context and any restrictions before editing or publishing.'],
 ['Campaign brief',/\bbrief\b/i,'The written plan explaining what to make, who it is for, allowed sources, deadlines, review and payment rules.']
];
function glossary(a,esc) {
 const text=[a.answer,...a.sections.flatMap(s=>[s.heading,...s.paragraphs,...s.points])].join(' ');
 const relevant=terms.filter(([,match])=>match.test(text)).slice(0,4);
 if(!relevant.length)return '';
 return `<details class="formula article-glossary"><summary>A few terms, explained</summary><dl>${relevant.map(([term,,meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl></details>`;
}
module.exports={glossary,terms};
