# Design, color, usability and search refinement

Research and implementation review: 8 October 2026. Scope: the public Clip by RiseKlix website, its 130 existing routes and 119 complete articles. This is a design and technical review, not a measured conversion study. Reference websites were inspected live; their visual patterns do not establish that they are fast or commercially successful.

## What the current site needed

The site already has distinctive original collage artwork, an editing exercise, a framing study, native scrolling, planning tools, strong Discord entry points and a large article library. Adding another animation system would contribute less than making those resources easier to use.

The main opportunity was discovery. Three broad links in the library did not explain which of 119 articles to read for a specific job. The homepage's two large illustrated audience cards offered a campaign path and a clipper path, but company owners and creators needed different practical sequences. Article evidence was available far down the page, with no direct link beside the byline.

The rendered foundation was already mostly neutral. Source inspection found an earlier cool palette followed by later neutral overrides. These duplicate definitions have now been consolidated into one light/dark token foundation. The change refines contrast and consistency; it does not represent the removal of a pervasive blue background from the previous rendered site.

The initial artwork was already responsive WebP. Its largest active variant was 281,414 bytes. Further encoding savings were available without inventing new artwork or changing the subject and composition.

## Creative website observations

These are observations from three live websites, not a statistical survey of 2026 design trends. The useful shared direction is strong editorial hierarchy, controlled color and named visitor tasks.

| Reference inspected | Observed pattern | Application to RiseKlix |
| --- | --- | --- |
| [Instrument](https://www.instrument.com/) | An oversized wordmark, neutral canvas, a contained media frame, work filters and separate project/team contact routes. | Keep the collage as a recognizable hero. Use bold scale for section headings and organize actions by the visitor's purpose. |
| [COLLINS](https://wearecollins.com/) | A single prominent statement, extensive breathing room and clearly named brand programs. | Give each reading journey one clear promise. Borrow the restraint and program structure while retaining Inter and the owner's neutral palette. |
| [Linear](https://linear.app/) | Charcoal layers, a concrete product introduction, numbered workflow chapters and labeled feature details. | Use neutral layers to separate context, choices and actions. Make interactive elements explain a useful task, as the existing framing study and calculators do. |

No reference media, case studies, customer logos, awards or testimonials were copied. The large media and customer proof on these sites are specific to their businesses. RiseKlix's editing exercises remain explicitly marked demonstrations.

## Color and composition decisions

[Carbon's current color guidance](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview) describes neutral layers, consistent token roles and progressively lighter dark surfaces. It was updated on 25 September 2026. The relevant principle is a stable visual hierarchy across themes, not copying IBM's complete palette.

RiseKlix now uses a single achromatic foundation:

| Role | Light | Dark | Purpose |
| --- | --- | --- | --- |
| Page | `#f7f7f7` | `#171717` | Quiet neutral canvas |
| Surface | `#ffffff` | `#1e1e1e` | Cards and expanded journey content |
| Secondary layer | `#ededed` | `#262626` | Selected disclosure and supporting controls |
| Main text | `#171717` | `#eeeeee` | Headings and actionable text |
| Supporting text | `#5a5a5a` | `#b2b2b2` | Descriptions, notes and metadata |

Blue labels identify explanatory reading, violet identifies the clipper/community route, and amber identifies company planning. Each route also has a written audience label and a visible expanded state. Color is supplementary, never the only way to understand a choice. Broad dark surfaces remain charcoal rather than blue-tinted.

The new journey layout pairs a large editorial heading and a restrained source/edit/next-step line with a structured reading sequence. Selected rows use a solid neutral layer and colored edge. Resource cards have rounded containment and a narrow collection accent: guides/platform explanations use blue, comparisons use amber, and journal cards use neutral ink. The actual collection names remain visible.

## Productive interaction, without a new runtime

[NN/g's progressive-disclosure guidance](https://www.nngroup.com/articles/progressive-disclosure/) is an established usability principle, published in 2006, rather than a newly discovered trend. It supports keeping primary tasks immediately available while making secondary detail accessible on demand.

The homepage now offers three curated journeys:

1. **Creators and YouTubers:** find a teachable moment, compare Reels and Shorts, then build a brief.
2. **Company owners and teams:** plan a useful webinar destination, explain a product task, then model campaign economics.
3. **Clippers and editors:** read the beginner workflow, understand reuse/originality, then examine actual payment conditions.

Each journey contains three existing full articles, short explanations of their value and a relevant campaign or Discord action. The homepage opens the creator route initially; changing routes closes the previous one.

The library keeps this helper closed initially. Search, category selection and the article grid remain directly available. Visitors who want a suggested sequence can open it, without a modal or an additional fetched content index.

[MDN documents named `details` groups](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) as a native way to keep one disclosure open at a time. That supplies keyboard activation and progressive enhancement without another interaction script. Browsers that lack the grouping behavior can still open the individual disclosures. All destination links and descriptions are delivered in HTML.

Existing System/Light/Dark choice, reduced-motion behavior, search, saved reading lists, calculators, contact forms and Discord-plus-guide behavior are retained. Focus rings and labels remain visible. [WCAG's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) informs the 4.5:1 normal-text target; the local checks are scoped samples, not a full accessibility certification.

## AEO, GEO and SEO: what the research changes

[Google's current generative-AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) emphasizes valuable content, technical accessibility and clear organization. It rejects special AI markup requirements and keyword-variation page proliferation. It also says there is no ideal article length or requirement to split content into tiny chunks. The decision here is to improve navigation and clarity around the existing articles rather than create more overlapping pages.

The supplied query table is a useful demand signal. “indian clipping campaign” received 101 clicks from 683 impressions, about 14.8% CTR; “clipping net” received 8 from 890, about 0.9%. These figures describe the supplied query table, not proven AI citations. The important content jobs are India-specific campaign operation, joining as a clipper, evaluating platforms and understanding permissions/payment. Competitor spelling variants should not become thin landing pages.

The implementation preserves every article body, original route, canonical URL, Article graph and editorial date. A source/editorial-note link now appears beside every article byline. Social-image dimensions and Twitter image descriptions have been added on all pages; the existing crawlable HTML, organization identity, breadcrumbs and sitemap remain intact.

The content audit found external references in 57 articles when article-level and section-level lists are combined; 62 are editorial workflow guides. Their existing evidence notes explain that recommendations are not measured market benchmarks. Adding a prominent evidence link improves transparency, but does not turn these articles into independently verified research. Future substantive revisions should prioritize those guides where current policy or provider claims need primary references, and add actual operator experience only when the owner can substantiate it.

The existing `llms.txt` is retained for services that might use it. It is not counted as a Google ranking or citation improvement. No fabricated author credentials, review ratings, awards, conversion figures or campaign outcomes were added.

## Measure search visibility using the right reports

[Google's Generative AI performance report documentation](https://support.google.com/webmasters/answer/16984139) says its worldwide rollout completed on 31 August 2026. It reports impressions from supported AI Overviews and AI Mode experiences by page, country, date and device. A report may be absent when there are insufficient impressions. The pasted ordinary query performance table alone cannot identify which clicks or impressions originated from an AI feature.

[Bing's AI Performance announcement](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) describes citation counts, cited pages and sampled grounding queries across supported AI surfaces. Citation frequency is not a ranking, a page's authority score or proof of placement in a particular answer.

After deployment, compare page groups over comparable date ranges: clipper-entry guides, creator/YouTube guides, company/niche guides and platform comparisons. Assess search impressions and actual useful outcomes separately. Record changes and dates so content, seasonality and indexing delays are not confused with the effect of a visual revision. No account settings, analytics events or Search Console access were changed in this turn.

## Image and performance decisions

[web.dev's LCP guidance](https://web.dev/articles/optimize-lcp) explains why important images should be discoverable in the initial HTML and receive appropriate loading priority. The hero remains a high-priority `picture`; article artwork retains a typed high-priority preload. Below-the-fold framing artwork remains lazy. Its responsive size hint now follows the actual study column rather than a whole-viewport hero assumption.

The existing WebP images were encoded as AVIF at their original dimensions, quality 65, 4:4:4 chroma. The largest AVIF was visually reviewed after decoding. This is lossy encoding, not a claim of pixel identity. The original files remain untouched and serve as format fallbacks.

| Width | Existing WebP bytes | AVIF bytes | Reduction |
| --- | ---: | ---: | ---: |
| 640 | 62,050 | 38,427 | 38.1% |
| 960 | 138,300 | 84,230 | 39.1% |
| 1536 | 281,414 | 179,898 | 36.1% |

The journey and theme CSS is compiled into the existing shared button/interface stylesheet, avoiding another stylesheet request. The combined file is 12,668 bytes, approximately 3,030 bytes with gzip; its predecessor was 6,391 bytes, approximately 1,571 with gzip. No JavaScript or runtime dependency was added. The core stylesheet also shrank after palette consolidation. These byte savings and costs are known; real-user LCP, INP, conversion and AI-citation changes require deployment and measurement.

## Verification and next priorities

The dedicated local check covers 30 layouts across five widths, both themes and home/library/article routes. It exercises keyboard journey selection, mutual disclosure, navigation into full guides, no-JavaScript company discovery, system-theme resolution, forced-color focus and image decoding. The sampled new journey text had a minimum contrast ratio of 5.63:1. All 130 pages have the updated social metadata; all 119 articles have source links.

Preservation checks confirm 114 protected source/asset files are unchanged, all 130 routes remain, and all 119 Article graphs and editorial dates are unchanged. Full-site validation and a controlled local performance comparison are recorded separately in this folder.

The final interleaved comparison used three cold-cache samples per version, a 390 × 844 Chrome viewport, no additional CPU slowdown, 150 ms network latency and 1.6 Mbps download throughput. Median LCP was 1,644 → 1,592 ms on home, 1,580 → 1,580 ms on the library and 1,644 → 1,548 ms on the sampled article. The library added about 6 KB of decoded resource content and its median load event was about 42.5 ms later. Its synthetic filter-to-two-frames timing was 5.6 → 15.9 ms; this small sample is sensitive to frame scheduling and is not real-user INP. These results do not establish a uniform speed improvement.

An initial library CLS increase (about 0.0144) exposed the optional toolbar/save controls appearing after initial layout. Reserving their eventual dimensions reduced the final library CLS to about 0.0013, versus the baseline 0.0015. The no-JavaScript stylesheet removes that reserved space. Final sampled home and article CLS were zero. See `theme-performance-first-pass.json` and `theme-performance-comparison.json` for individual runs and ranges.

Next useful improvements depend on evidence: first-party campaign examples with permission and documented results; deeper source checks for policy-bearing older guides; field performance by device; and Search Console/Bing page-level visibility. These are stronger authority signals than decorative effects, unsupported claims or another batch of near-duplicate keyword pages.
