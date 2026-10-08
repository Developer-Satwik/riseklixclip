# Interactive atelier revision — 7 October 2026

This local revision makes the existing clipping website more expressive and useful while preserving the 113 articles, 124 routes, production canonical paths and search metadata. The reference download, inspiration images, authenticated parent app and hosted website are unchanged. No publication, deployment or indexing submission occurred.

## Design and interaction

The interface now uses neutral paper and graphite values with Inter throughout. Existing blue, violet and amber retain their reading and planning roles, while dark mode stays charcoal. The existing artwork remains the visual centre of the homepage, with a quieter typographic hierarchy, a vertical source/story annotation and a brief entrance.

The new **cutting desk** turns source selection into an editing exercise. Visitors can switch among podcast, stream and founder examples, with a source note, illustrative waveform/timecodes and three decisions: moment, edit and destination. The source lines and timecodes are explicitly fictional; they are not clips, recordings, customer evidence or campaign results. Each exercise leads to a relevant existing guide. All three remain visible without JavaScript.

Collection heroes now resemble printed index plates, with the actual resource count, framing and a collection motif. Cards have a folded-corner treatment and restrained link feedback. The library offers gallery and compact index layouts, with a persistent browser preference. Existing keyword search and collection filters continue to work in both layouts.

Readers can save articles to a **browser-only reading list**, combine saved filtering with search/categories, and return to saved articles from the library. Saving/removing updates other open tabs on the same origin. There is no account, server synchronisation, analytics event or background request. When storage is unavailable, the interface explains that the state only applies to the current page. Removing the last visible saved item returns keyboard focus to the saved filter.

Every article has save and copy-link controls. Clipboard failures produce instructions instead of a false success message. Contents navigation highlights the current section using one IntersectionObserver, with its viewport band recalculated after a debounced resize. A native contents disclosure starts collapsed on mobile and remains operable without JavaScript. Article text, sources, FAQ disclosures, named scrollable tables and the guide-plus-Discord action remain available.

## Performance choices

The revision adds no image downloads, third-party script, animation framework, video player, canvas or continuous pointer/scroll loop. The original continuous hero drift is replaced by one short entrance. Feedback animations use transform/opacity and respect reduced motion. These choices follow [web.dev’s animation performance guidance](https://web.dev/articles/animations-guide) and [W3C’s reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39). Contents tracking uses the browser’s asynchronous [Intersection Observer API](https://w3c.github.io/IntersectionObserver/), rather than polling positions on every scroll frame.

Inter is still self-hosted, with its 100–900 weight range and 14–32 optical-size range. The original 352,240-byte full font is retained as an asset for provenance but is no longer requested by the page. The preload now selects a **72,920-byte Latin subset**, and a **3,840-byte symbol subset** covers the requested currency/navigation symbols. Other language subsets are available through Unicode ranges when needed. No Google Fonts request occurs at runtime. Source URLs, hashes and ranges are recorded in [the font manifest](inter-font-subsets.json), with both original and subset licences retained. Variable-font and character-subsetting requests follow the [official Google Fonts CSS API documentation](https://developers.google.com/fonts/docs/css2).

The shared CSS/script have explicit 52 KB/16 KB raw-size guards. Gzip sizes in the reports are calculated compression estimates; the Python preview does not claim to deliver those compressed sizes. No article text was removed to make a benchmark smaller.

The build now compiles `src/styles.css` into the public stylesheet. A browser CSSOM comparison confirms that all 396 top-level rules remain identical after compilation. The output is 48,105 bytes, with a 10,606-byte gzip estimate; the shared script is 12,838 bytes, with a 4,287-byte gzip estimate. Above-the-fold article artwork is eagerly loaded, preloaded in the document head and assigned high fetch priority. This corrects the earlier lazy loading of a potential LCP image, following [web.dev’s LCP image guidance](https://web.dev/articles/optimize-lcp).

## Verification records

- [Complete route and article rendering checks](verification.json): all 124 pages and 113 authored article bodies, metadata, canonicals, images, links, fragments, narrow layouts and existing interactions.
- [Interactive design checks](interactive-design-verification.json): keyboard exercises at 1440/390/320 in both themes, gallery/index layouts, persisted saves, cross-tab updates, combined filtering, focus recovery, clipboard success/failure, blocked storage, active contents, mobile disclosure, no-JavaScript fallback and idle/reduced-motion behaviour. Clipboard paths use an isolated stub and do not alter the system clipboard.
- [Long-form regression checks](longform-verification.json): six established articles, short laptop contents access, narrow tables, native FAQs and guide-plus-Discord behaviour, with the external request intercepted.
- [Sampled contrast checks](accessibility-performance.json): light/dark controls, reading surfaces and the new components. This is not a full WCAG conformance assessment.
- [Final asset checks](design-assets-verification.json): identical compiled CSS rules, high image priority on every article, decoded artwork, single headings and layouts at 1440/820/390/320 pixels.
- [Paired loading comparison](design-performance-comparison.json): controlled cold-cache observations for home, library and one comprehensive comparison article. Both versions are served from memory on localhost, alternate order between runs and use identical viewport/network/CPU settings. This reduces changing filesystem I/O during the comparison. Initial sequential results remain in design-performance-baseline.json and design-performance-after.json, with the latter recorded before font optimisation under changing machine load. The first paired run is retained in design-performance-before-image-priority.json. A later fourfold-CPU run timed out on the current library; its partial console observations and failure are preserved in design-performance-host-load-incomplete.json. The final comparison uses no additional CPU slowdown on this already-busy host, while retaining the same cold-cache network settings for both versions. This is a methodological change, not a directly comparable continuation of the fourfold runs.

These are local observations, not real-user Core Web Vitals, a ranking gain or an AI-citation result. Screenshots in `docs/screenshots/interactive-atelier/` provide representative desktop/mobile views.

## Observed loading results

The final paired comparison used three cold-cache samples per version and route at 390 × 844 pixels, 1.6 Mbps download, 150 ms simulated latency and no additional CPU slowdown. Both snapshots were served from memory, with the middle pair reversing order. Resource totals below are decoded external asset bytes; they exclude the HTML document.

| Route | Asset bytes, previous → current | Median load, previous → current | Median LCP, previous → current | Current LCP range |
| --- | ---: | ---: | ---: | ---: |
| Home | 459,396 → 205,067 | 3.31 s → 15.39 s | 1.98 s → 17.06 s | 2.58–18.53 s |
| Library | 392,252 → 137,923 | 3.10 s → 2.13 s | 1.77 s → 1.92 s | 1.91–1.99 s |
| Comparison article | 459,396 → 205,067 | 3.00 s → 1.84 s | 2.24 s → 1.80 s | 1.36–11.29 s |

The typical font transfer fell from 352,240 to 76,760 bytes (78.2%). Total measured external assets fell by 55.4% on the home/article and 64.8% on the library. CLS remained below 0.024 in the sampled runs. Library filtering took 48.1 ms to the synthetic two-frame paint marker versus 26.6 ms previously; this is not a real-user INP measurement.

**The timing evidence does not establish a uniform performance improvement.** The home samples include 10-second and multi-second main-thread stalls, and one article sample has a 5.6-second task. These occurred amid changing host load, but the exact attribution is unresolved; the smaller payload does not rule out a rendering cost. The earlier fourfold paired home result was 1.22 s versus 1.36 s LCP, before the final image-priority/CSS changes. The severe later outliers are retained rather than excluded. A controlled-host or deployed preview comparison is still needed to establish loading performance before any future publication. No such publication is authorised or performed here.
