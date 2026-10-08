# Campaign positioning and client journey refinement

Reviewed and implemented on 8 October 2026. Baseline: `e8ef7c353e532487c549a5a029315eac3ca75950`.

The purpose of this pass is to make the managed campaign offer easier to understand and the first enquiry easier to write. Premium presentation means clear hierarchy and care in the details; it does not imply a higher price or a minimum spend.

## What the audit found

The homepage had a clear campaign button, prominent Discord entry and strong artwork. Its general introduction explained clipping, but the client had to assemble the service scope from the process section, articles and contact page. Editing exercises and the artwork study appeared before the detailed workflow. The primary navigation listed four resource categories, while the workflow was available lower down and in the footer.

The enquiry already required only name, email and an idea. Asking someone to describe their project is still an open writing task. A visitor who wants help may benefit from a concrete example without receiving a prewritten or automatically submitted enquiry.

These are findings from a source and interface review, not observed failures from a participant usability study. No conversion improvement has been measured.

## Research and how it informed the change

- [NN/g: Homepage Design — 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/) explains the importance of communicating the organisation’s purpose and helping different audiences find their main tasks. Its advice about visual hierarchy and predictable navigation supports a clearer client overview alongside the clipper route. This is established usability guidance, not a new 2026 visual trend.
- [GOV.UK: Designing good questions](https://www.gov.uk/service-manual/design/designing-good-questions), updated 24 June 2026, recommends purposeful questions, understandable wording and relevant help. Its disclosure guidance supports optional examples for people who need them. Applying that pattern here is a design judgment; we have not conducted audience research proving that every client needs help text. The original three-field form remains intact.
- [GOV.UK: Text input](https://design-system.service.gov.uk/components/text-input/) distinguishes short hints from longer explanations. The examples live in a separate disclosure rather than extending the field’s accessible hint with two paragraphs. They are optional reading, and the actual textarea retains its own label.
- [COLLINS: Brand Creation](https://wearecollins.com/programs/brand-creation/) provides a current creative-agency example of separating a broad positioning statement from concrete program features. The useful structural lesson is making the offer legible. Its client proof, awards, outcomes and pricing position are not transferable to RiseKlix and have not been reused.
- [W3C: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) documents the WCAG 2.2 minimum target requirement and exceptions. The new disclosures use targets of at least 44 CSS pixels in local checks, a more generous choice than the basic 24-pixel requirement. Sampled checks are not a full WCAG conformance audit.
- [MDN: details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) documents native disclosure and grouping by `name`. The homepage examples need no JavaScript. Browsers without grouping support can still reveal each example independently.
- [Google Search Central: Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) continues to emphasise useful content and the existing Search foundations. This pass makes the business description and next steps more understandable in rendered HTML. It does not add special AI markup, competitor keyword pages or claims of guaranteed inclusion.

## Implemented design and positioning

The general homepage introduction has been replaced by a campaign overview headed “Your videos. A campaign with a plan.” It identifies RiseKlix as a managed clipping network and separates three responsibilities:

1. **You bring:** the goal, audience and approved source videos.
2. **We plan together:** moments, clip count, language, formats, publishing accounts and reviewer.
3. **The agreed work:** edits and reviews, with delivery, publishing, reporting and payment terms confirmed in writing.

These are scoping questions, not package promises. No campaign count, turnaround, price, channel access, results or client evidence has been invented.

Two native example directions cover creators and company teams. They explain useful starting material, the intended question or moment and what to discuss. Each links to an existing comprehensive guide. Only one is expanded at a time in browsers supporting named disclosure groups. The visitor controls expansion; there is no autoplay, carousel or hover-only content.

The visual treatment uses an editorial split heading, a ruled responsibility list, clear open-state surfaces and small circular disclosure indicators. It inherits Inter, the light/charcoal foundation, labelled semantic color and existing button/focus treatment. The original artwork and transparent official logo are preserved.

The overview’s button opens the existing contact form at its enquiry anchor. It does not append private information to a URL, create a draft or select a budget. The form’s new “Need an example to get started?” disclosure shows two clearly labelled example ideas. Opening it never inserts text into the visitor’s answer. The form still requires exactly three fields.

The first primary-navigation item is now “How it works,” followed by Resources, Compare and Articles. Guides remain available from Resources, the footer and the existing clipper entry. The homepage chapter bar now includes “Plan a campaign.” The prominent clipper section remains before the client overview, and the hero/header Discord actions and guide-plus-Discord behavior are retained.

## Preservation and performance boundary

All 119 complete article objects match the baseline hashes, including their introductions, bodies, FAQs, sources and metadata. All 130 routes remain. Existing core CSS, button/theme CSS, shared JavaScript, enquiry module, hero AVIF and transparent logo match their baseline hashes. Search and article structured data retain the same content and production canonical URLs.

The new homepage stylesheet is **3,480 bytes**, or **1,040 bytes with gzip in the local measurement**. It loads on the homepage only. The contact help styles add **757 bytes before compression** to the existing contact stylesheet. No additional JavaScript, font, image or third-party request was added. The homepage has one extra small CSS request; this is a deliberate cost, not a claim of zero overhead. The core reading bundle stays within its existing budgets.

Under the report’s local 390-pixel viewport, 150 ms network latency and 1.6 Mbps connection simulation, median homepage LCP changed from **1,592 to 1,628 ms** (+36 ms), and contact LCP from **1,296 to 1,300 ms** (+4 ms). Median layout shift was zero for both routes and both versions. There were three interleaved samples per version per route. The run shows a small local loading cost; it does not establish a field improvement or statistical significance.

The indexing-progress files in the separate app workspace are unchanged. This design pass creates no new page URLs and does not establish that Google has indexed any previously submitted URL.

## Verification evidence

- `docs/verification.json`: all 130 routes at desktop and narrow widths, 119 rendered article-depth checks, metadata, internal links and shared interactions; zero issues, browser errors or failed local requests.
- `docs/client-journey-verification.json`: 16 homepage/contact layouts across 1440, 820, 390 and 320 pixels in light and dark themes. Keyboard and touch disclosure, chapter focus, guide discovery, empty enquiry entry, visitor-answer preservation, three required fields, mock submission, no-script operation and forced-color focus passed. The minimum sampled text contrast was approximately **5.89:1**. No live email was sent.
- `docs/campaign-api-verification.json` and `docs/campaign-browser-verification.json`: existing validation, sending state, retry, recovery and native form boundaries passed with provider calls mocked. Actual Resend delivery remains unverified.
- `docs/scroll-ui-verification.json`: 16 responsive chapter/reading-navigation layouts, deep links, history, expanded FAQ geometry and cached scrolling passed. The new overview originally used an excessive anchor offset; its jump could leave the previous chapter highlighted. Matching the existing anchor spacing corrected that defect before the final pass.
- `docs/design-assets-verification.json`: existing compiled core CSS equivalence, 119 article image-priority checks and representative layouts passed.
- `docs/client-navigation-verification.json`: eight widths from 320 to 1600 pixels, including both sides of the 1100-pixel navigation breakpoint, had no header overlap or page overflow.
- `docs/client-journey-performance-comparison.json`: interleaved local home/contact measurements against the saved baseline. Read its conditions, sample ranges and limitations with the medians. These are not field Core Web Vitals or a real-user conversion measurement.

Screenshots are saved locally under `docs/screenshots/client-journey/`. They are excluded from Git by the existing repository policy.

## Next evidence that would be useful

Ask a few creators and company owners to explain what they think the service includes, find the correct route and write an enquiry in their own words. Measure starts, validation errors and completed enquiries only with an explicit analytics design and suitable privacy treatment. Verified campaign evidence would strengthen trust more than invented proof or additional decorative effects.
