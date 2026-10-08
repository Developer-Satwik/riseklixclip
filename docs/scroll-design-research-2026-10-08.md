# Scroll design: orientation, movement and useful control

Research and implementation: 8 October 2026. Baseline: `431d791226d35f87e618609ca5a7ba7080a33e95`. This analysis distinguishes observed website behavior, published guidance and design judgments. It does not claim an industry-wide trend ranking, improved conversions or additional search citations.

## What the current pages needed

The local baseline in `scroll-ui-baseline.json` showed a homepage 8,981 pixels high at a 1440-pixel width and 11,774 pixels high at 390 pixels. The beginner guide was 9,802 and 14,712 pixels high respectively. At a scroll position of 1,800 pixels, the main header was outside the viewport in all four samples. The guide's desktop contents rail remained visible, but mobile readers had no visible section navigation or progress feedback.

The artwork, chapter numbers, neutral surfaces and interactive editing examples already give the site a recognizable visual direction. The useful next step is to connect those sections into a navigable journey and help readers move through the long articles. Adding more image weight or blocking access to article text would not resolve the observed navigation gap.

## Research and current patterns

### Native scroll-driven motion is a practical enhancement

[Chrome's scroll-driven animation documentation](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) demonstrates timelines driven by scroll position and element visibility, including progress indicators implemented with transforms. The March 2026 [Safari 26.4 WebKit release](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/) reports moving supported scroll-driven animations to the compositor thread.

These primary sources establish a current platform capability, rather than proving that every device or browser behaves identically. The implementation uses feature queries for decorative motion. Unsupported browsers retain the static artwork and complete navigation. No browser-support polyfill or animation library is required.

### Scrolling should communicate location

[Nielsen Norman Group's table-of-contents guidance](https://www.nngroup.com/articles/table-of-contents/) describes the value of section navigation on long pages, clear labeling and current-section highlighting. Applied to this website, the large article library needs more than a contents list that disappears on mobile.

Decision: add a compact sticky article dock with a native section picker, an explicit Go button, article scroll-position feedback and a return-to-top link. The native picker avoids adding a second custom modal or a long overlay over the article. The desktop contents rail continues to work and shares the same current-section state. An evidence link is now present even when an older article's evidence note has no external references.

### Persistent controls need to earn their space

[NN/g's sticky-header analysis](https://www.nngroup.com/articles/sticky-headers/) recommends keeping persistent navigation small, legible and minimally animated because it consumes reading space. Its [back-to-top guidance](https://www.nngroup.com/articles/back-to-top/) explains when returning to the top is useful on long pages and why a clear label matters.

Decision: retain the existing large header in normal document flow. The homepage instead gets a compact chapter bar after the hero. Articles get their own smaller navigation dock inside the article. The Top control sits in those bars, avoiding an additional floating control over mobile paragraphs. Both sticky bars stop with their parent content before the footer.

### Protect attention and motion preferences

[NN/g's scrolling-and-attention research](https://www.nngroup.com/articles/scrolling-and-attention/) supports keeping important content easy to scan and placing consequential actions early. [W3C's animation-from-interactions explanation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) addresses allowing nonessential interaction-triggered motion to be disabled.

Decision: preserve the visible clipper invitation and campaign action. A small hero link indicates that the story continues below. Decorative effects run only with no reduced-motion preference and native CSS timeline support. Article text remains fully opaque and available throughout. The reduced-motion experience retains section navigation and position feedback while disabling the decorative motion and smooth scrolling.

## How the design now behaves

| Area | Implemented behavior | User benefit |
| --- | --- | --- |
| Hero | Native “Explore the story” anchor; subtle desktop-only artwork depth as it leaves the viewport. | Signals continuation while preserving the primary actions and mobile artwork crop. |
| Homepage | Four chapters: joining, the creative studio, the process and the field library; sticky index with current-chapter indication. | Lets visitors explore or skip to the part relevant to them. |
| Process section | Thin rules fill as rows enter view; chapter headings settle by 16 pixels. | Connects the editorial layout to scrolling without withholding text. |
| All 119 articles | Sticky section picker, explicit Go action, position percentage and Top link. | Makes long mobile guides easier to navigate. |
| Contents and evidence | Current-section highlighting and a complete evidence destination. | Keeps the two navigation views consistent with the article's actual sections. |
| Keyboard navigation | Chapter and picker actions move focus to the selected section; Top returns focus to the brand link. | Keeps subsequent keyboard actions in the place the visitor selected. |
| No JavaScript or module failure | Chapter anchors, static Contents links, full article text and native scrolling remain. | Provides a usable baseline when enhancement code is unavailable. |

The percentage describes position through the article's answer-to-evidence span. It is not an estimate of reading time or proof that the visitor read the content. The range is recalculated when the viewport or content size changes, including expanded FAQs and font loading.

## Performance and preservation

The new assets load only on the homepage and article pages. Hubs, the campaign form and short utility pages do not request them. The old contents observer is removed from the shared script so that two implementations do not compete for current-section state. The new controller caches section geometry on size changes and uses one passive scroll listener with scheduled updates; it does not continually measure boxes during stable scrolling.

The actual asset sizes and stable-scroll geometry checks are recorded in `scroll-ui-verification.json`. Decorative animation uses transforms, not animated layout dimensions. There are no additional images, videos, fonts, embeds or third-party runtime dependencies. This is a lightweight implementation choice, not a claim that field Core Web Vitals or ranking scores have improved.

Measured gzip sizes are 1,563 bytes for the new stylesheet and 1,418 bytes for its controller. Removing the old contents observer reduces the shared script by 315 gzip bytes, giving a net increase of 2,666 gzip bytes on enhanced pages. The shared stylesheet remains 59,962 uncompressed bytes. A stable 40-step article scroll performed zero `getBoundingClientRect()` calls after geometry was cached. These are local payload and geometry observations, not network-transfer or real-user speed measurements.

All 130 routes, 119 authored articles, their search metadata and structured data are preserved. The official logo, transparent footer, charcoal/light palette, responsive artwork, campaign backend and direct Discord invitation remain. Editorial dates are not changed for this navigation revision. A file and metadata comparison is recorded in `scroll-ui-preservation.json`.

## Verification and limits

`verify-scroll-ui.mjs` checks chapter jumps, keyboard focus, section picking, current-section state, narrow layouts, deep links, history, expanded FAQ geometry, native motion and reduced motion, no-JavaScript access, module failure, and return-to-top behavior. The all-page and long-form reports provide the wider content/layout checks. Screenshots were inspected locally for desktop and mobile in both themes.

The sixteen completed light/dark layout cases are recorded separately in `scroll-ui-layout-verification.json`. The remainder of the journey check was resumed after correcting its fixture to load offscreen lazy images before awaiting their decoding. That fixture change does not alter how the website loads images. The final report combines the completed layout evidence with the subsequent fallback, motion and geometry checks.

The implementation has been exercised in local Chrome. WebKit documentation informs the design but does not substitute for running it in Safari; Safari and Firefox execution are not claimed. No conversion uplift, search improvement, AI citation gain or field performance change has been measured. The next product measurement should compare section-navigation use and completed visitor tasks over equivalent traffic periods; no new tracking or account actions are introduced here.
