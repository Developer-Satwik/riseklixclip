# Clip by RiseKlix

A local redesign and expansion of the clipping website supplied in `deploy-6a4285139d26182faaa025ed.zip`. All 104 original routes are retained; two rounds of ten researched articles plus six audience/niche guides bring the local website to **130 pages and 119 articles**. This is separate from the authenticated RiseKlix discovery app in the parent workspace. This repository contains the website source, generated static pages and Netlify Function. Hosting is connected separately in Netlify.

Preview: **http://127.0.0.1:8770/**

## Run

```sh
cd riseklixclip
npm run build
npm run preview
```

The build and preview use Node built-ins (Node 22 or newer). The preview listens only on localhost and serves the static pages plus the campaign enquiry API. No package installation is needed. Existing page URLs and production canonical URLs are preserved.

## Connect to Netlify

Import `Developer-Satwik/riseklixclip` from GitHub and select the `main` branch. The root `netlify.toml` configures:

- Base directory: leave blank (repository root).
- Build command: `npm run build`.
- Publish directory: `public`.
- Functions directory: `netlify/functions`.
- Node.js: 22.

These values are file-based configuration; no manual upload or frontend framework preset is required. See [Netlify configuration documentation](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

For campaign enquiries, add `RESEND_API_KEY` to Netlify environment variables with Functions scope (or all scopes). The key must stay outside the repository. Sender and recipient default to `contact@riseklix.com`; optional server overrides are `RESEND_FROM_EMAIL` and `CAMPAIGN_TO_EMAIL`.

Add your exact Netlify origin, such as `https://your-site-name.netlify.app`, to `CAMPAIGN_ALLOWED_ORIGINS` for Functions. Comma-separate additional exact origins you want to permit. The form already accepts `https://clip.riseklix.com`; a new Netlify hostname is not automatically authorised. Redeploy after setting or changing the variables. See [Netlify Function configuration](https://docs.netlify.com/build/functions/configuration/).

Production canonical URLs and the sitemap remain `https://clip.riseklix.com`. Connect that custom domain in Netlify when making this the production site. If using a different permanent domain, update the origin and form configuration deliberately before publishing.

The build uses Node built-ins and needs no additional dependencies. Local verification scripts document the authoring machine's browser-runtime paths; they are not part of the Netlify build. Historical reports describe local checks, not a completed hosted deployment or verified email delivery.

## Campaign email setup

Copy `.env.example` to `.env.local` in this directory and set `RESEND_API_KEY` there. The preview loads this file at startup, so restart `npm run preview` after adding the key. Keep the key out of browser files, Git and shared archives. The default sender and recipient are `contact@riseklix.com`; `RESEND_FROM_EMAIL` and `CAMPAIGN_TO_EMAIL` can override them on the server. The visitor's validated email is Reply-To.

Resend requires a verified sending domain. Also confirm that `contact@riseklix.com` can receive email through your mailbox or Resend inbound setup; a verified sender alone does not establish a receiving inbox. No account configuration, live sending or delivery has been verified in this local revision. Until a key is configured, the page keeps answers and offers copy/email/Discord alternatives.

The Netlify function and same-origin API rewrite are included. Configure the variables for Functions when connecting hosting; uploading only `public/` cannot run this email endpoint. A live deployment and delivery still require verification in your Netlify/Resend accounts. Run `npm run verify:campaign` for mocked API and browser checks that do not send live emails.

## What changed

- Native scroll interactions now connect the homepage's four chapters, with an active chapter index, a scroll cue and restrained artwork/process motion. All 119 articles have a compact sticky section picker, scroll-position feedback and return-to-top control. Keyboard jumps, deep links, changing FAQ heights, reduced motion and static fallbacks are checked. See `docs/scroll-design-research-2026-10-08.md` and `docs/scroll-ui-verification.json`.
- Clippers now have a visible “Join Discord” action outside the collapsed menu on every page, a filled hero action, an early three-step entry section, a prominent beginner-guide invitation, contextual invitations on 20 clipper articles, and a direct footer button. The hero retains the guide-plus-Discord behavior with a visible new-tab explanation; ordinary Discord links work without JavaScript or popups. See `docs/clipper-entry-research-2026-10-08.md` for research and verification limits.
- The owner-supplied official RiseKlix logo now appears in the navbar, footer, browser icons, campaign response pages and Organization metadata across all 130 pages. The original artwork is preserved; compact assets only trim padding and resize it. The full footer lockup is transparent; its lettering turns white in dark mode while the ribbon retains its original colors. See `docs/brand/official-logo-2026-10-08.md`.
- An original charcoal-and-paper art collage with figures and architectural layers; torn-paper transitions; large chapter numbers; restrained motion with reduced-motion support. The revised artwork follows the supplied art references more closely than the archived film-ribbon first pass.
- Inter throughout, System/Light/Dark, and a refined neutral charcoal dark mode. Blue/violet/amber labels distinguish answers and planning tools without navy background panels.
- Targeted anatomy repair on 8 October 2026 corrects the main hands and refines the dancer, seated figures and birds while preserving the existing art direction. Revision-3 image files are smaller at all three responsive sizes; revision 2 remains archived. See `docs/artwork-v3.md`.
- Mobile hero artwork sits below the headline and actions, with a landscape crop that preserves the figure and architectural scene. Article artwork also stays visible on narrow screens.
- Shared templates for home, all hubs, all 119 articles, contact, docs and policies.
- Two individual depth revisions of all 93 articles. Each now has 10–13 substantive sections and 5–6 FAQs, with focused answers, worked examples, practical worksheets, creative storyboards, language exercises, troubleshooting and contextual next reads. The second pass adds four topic-specific sections and two FAQ answers to every article. References sit beside the claims they support. Reading times and Article word counts follow the expanded text.
- Ten additional articles researched and written on 7 October 2026, covering India feasibility, budgets, rights, legitimacy, agency selection, tool categories, YouTube reused content, UTM tracking, accessible captions and auditable case studies. Each has twelve substantive sections and six FAQs; together they add 19,776 reading words, thirty practical tables and thirty-three contextual links from existing articles. New local drafts have actual creation dates and are not backdated to the original publication.
- A second ten-article research expansion adds four comparisons, three Learn guides, two platform explainers and one Journal essay. Topics cover clipping/editing/UGC, Reels/Shorts, publishing accounts, attribution methods, rejected submissions, paid test assignments, landing pages, Facebook originality, Twitch permissions and audience continuity. Each has thirteen substantive sections, six FAQs, three tables and a separately authored worked scenario. They add 20,424 reading words, cite nineteen distinct primary-reference URLs and have thirty contextual inbound connections from the established library.
- Six new audience and niche guides researched on 8 October 2026 cover YouTube tutorial Shorts, B2B webinar enquiries, sponsored influencer content, restaurants/cafés, real estate walkthroughs and fashion product demonstrations. They add 15,932 reading words, 84 sections, 45 FAQs, 16 tables, thirteen distinct primary-reference URLs and eighteen contextual inbound links. Each has a visible AI-assisted editorial method, actual draft dates, and clearly hypothetical examples. All preceding 113 article bodies remain intact.
- A researched campaign enquiry page with three required fields, optional context, accessible validation, retained answers on failure, honest provider-acceptance feedback, and server-side Resend integration. Enquiry details are not automatically stored in the browser. The detailed browser draft builder is optional; clippers have a separate guide/Discord route.
- Functional ROI and earnings estimators with transparent formulas, validation, zero-view handling and reward caps. Figures are user inputs, not campaign results.
- An interactive cutting desk with three clearly fictional editing exercises, printed collection index plates, folded resource cards and restrained feedback. The hero has one short entrance instead of a continuous animation.
- Gallery/index layouts, browser-only saved articles, cross-tab reading-list updates, copy-link controls, active contents navigation and a native mobile contents disclosure. Storage/clipboard failures have honest fallback messages.
- Smaller self-hosted Inter Unicode subsets retain the same typeface, weight and optical-size ranges. The main preload drops from 352,240 to 72,920 bytes, with a 3,840-byte symbol subset; language subsets load when needed.
- Above-the-fold article artwork is preloaded and given high loading priority. The build compiles the shared CSS while retaining an editable stylesheet source.
- Resource search, collection filters, newest research first, three curated learning paths, keyboard/Escape mobile navigation, breadcrumbs, tables of contents and relevant next reads. “I want to clip” takes the current tab to the clipper guide and opens the existing Discord invite in a new tab.
- A framing studio lets visitors explore landscape, portrait and square art crops with focal-point, caption-guide and reset controls. A keyboard-accessible search dialog searches all 119 articles, with collection filters and full-library links. Feature code and the search index load on demand; campaign code/styles are limited to the contact page.
- Unique metadata, original canonical paths, coherent entity markup, Article and BreadcrumbList where appropriate, refreshed sitemap, self-hosted font and responsive WebP artwork. Removed blanket HowTo/FAQPage markup.
- Netlify source/functions moved outside the public directory. Callback error strings are HTML-escaped to address the audit’s reflected markup issue.

## Source

- `src/build.cjs`: the shared templates and 130-page generator.
- `src/clipper-entry.cjs`, `src/clipper-entry.css`: clipper entry sections and page-specific styling.
- `src/scroll-ui.cjs`, `src/scroll-ui.css`, `public/scroll-ui.js`: homepage chapter navigation and article reading controls, loaded only on those pages.
- `docs/scroll-ui-baseline.json`, `docs/scroll-ui-layout-verification.json`, `docs/scroll-ui-verification.json`, `docs/scroll-ui-preservation.json`: observed scroll gaps, completed responsive checks, enhancement/fallback checks and content preservation.
- `docs/clipper-entry-research-2026-10-08.md`, `docs/clipper-entry-verification.json`, `docs/clipper-entry-preservation.json`: primary-source UX research, Discord journey checks and preservation evidence.
- `src/content.cjs`: editorial revisions and focused answers.
- `src/design.cjs`: cutting-desk examples and progressive reading/library controls.
- `src/styles.css`, `src/minify-css.cjs`: editable shared styles and conservative CSS compilation.
- `src/editorial/`: individually authored expansions grouped by subject; helpers format sections and do not generate repeated prose.
- `src/editorial/depth/`: the second individually authored revision for every article.
- `src/editorial/researched/`: the first ten new articles, shared primary-reference catalogue and contextual backlinks.
- `src/editorial/researched/round-two/`: the second ten articles, topic plan, original worked scenarios and contextual backlinks.
- `src/editorial/researched/round-three/`: six audience/niche guides, approved intent plan, primary sources and contextual backlinks.
- `src/articles-original.json`: supplied source data retained for provenance.
- `src/original-generator.cjs`: archived original generator; not the current build entry point.
- `src/utility-original.json`: original utility/policy text. Substantive policies and their June 25 effective date are preserved. Presentation dates are distinguished from policy dates.
- `public/`: the static website and its assets.
- `netlify/`, `netlify.toml`: configuration/source only; no deployment performed.
- `docs/search-and-design.md`: query priorities, evidence and design rationale.
- `docs/artwork.md`: exact generation prompt and saved asset paths.
- `docs/verification.json`: final all-page browser and interaction check results.
- `docs/article-expansion-report.md`: before/after coverage, every article’s distinct purpose and source-check limitations.
- `docs/deep-expansion-report.md`: the second revision’s article-by-article purposes, coverage and first-pass comparison.
- `docs/new-article-research-2026-10-07.md`: current online research, supplied-query analysis, topic gaps and future citation measurement.
- `docs/new-articles-report.md`: all ten new articles, coverage, evidence and library integrity results.
- `docs/researched-article-verification.json`: all ten new pages checked in both themes, narrow layouts and without JavaScript.
- `docs/research-round-two-2026-10-07.md`: second-round research, topic-gap analysis, primary sources and their limits.
- `docs/research-round-two-report.md`: article-by-article coverage and integrity results for the second cohort.
- `docs/research-round-two-verification.json`: latest ten pages checked in both themes, short laptop and narrow layouts, and without JavaScript.
- `docs/research-round-three-2026-10-08.md`, `docs/research-round-three-report.md`: latest audience/niche research, article coverage and source limits.
- `docs/research-round-three-verification.json`, `docs/research-round-three-discovery.json`, `docs/research-round-three-preservation.json`: all six page layouts, library/search discovery and preservation of the preceding 113 article bodies.
- `docs/interactive-design-2026-10-07.md`: design decisions, interaction scope, font provenance and performance method.
- `docs/interactive-design-verification.json`: new interaction, fallback, layout and bundle-size checks.
- `docs/design-performance-comparison.json`: paired cold-cache comparison of the previous package and current design.
- `docs/design-assets-verification.json`: browser CSS-rule equivalence, all 119 article image priorities, decoded artwork and responsive layout checks.
- `src/contact.cjs`, `src/contact.css`, `public/campaign-enquiry.js`: the simplified campaign journey and its page-only assets.
- `server/campaign-enquiry.mjs`, `scripts/preview.mjs`: shared email handler and local preview/API server.
- `docs/campaign-enquiry-research-2026-10-08.md`: primary-source research, implementation decisions, setup and remaining verification.
- `docs/campaign-api-verification.json`, `docs/campaign-browser-verification.json`: mocked email, real local validation bridge, browser failure/retry and mobile checks.
- `docs/studio-design-2026-10-08.md`, `docs/studio-verification.json`: framing/search decisions, loading budgets and browser verification.
- `docs/accessibility-performance.json`: sampled contrast and local browser observations.
- `docs/longform-verification.json`: short-laptop contents navigation, narrow-screen tables, themes, FAQs and the guide-plus-Discord action.
- `docs/screenshots/`: local rendered views; `interactive-atelier/` contains the latest representative design views; `charcoal-mobile/` retains the earlier theme checks.

## Verification

The included verification scripts use the Codex-bundled Playwright installation and system Chrome on this machine. Update the Playwright import path if running elsewhere.

```sh
npm run verify
npm run verify:clippers
npm run verify:scroll
node scripts/audit-editorial.cjs
node scripts/audit-researched.cjs
node scripts/audit-researched.cjs 2
node scripts/verify-researched.mjs
node scripts/verify-researched.mjs 2
node scripts/audit-researched.cjs 3
node scripts/verify-researched.mjs 3
python3 scripts/verify-audience-preservation.py
node scripts/verify-longform.mjs
node scripts/verify-interactive-design.mjs
node scripts/verify-design-assets.mjs
node scripts/accessibility-performance.mjs
node scripts/screenshots.mjs
node scripts/screenshots-interactive.mjs
```

The all-page check covers 1440, 390 and 320 pixel widths, metadata, H1s, canonical URLs, structured data, internal links, fragments, image loading and control labels. It also verifies every article’s rendered section and FAQ questions against the authored source and confirms every authored body paragraph appears on the page. Interaction checks cover navigation, themes, reduced motion, search, both calculators, empty drafts, saved draft restoration, downloads and clearing. Long-form checks cover contents navigation on a 600-pixel-high laptop viewport, keyboard access to the final contents link, named scrollable tables at 320 pixels, light/dark reading and native FAQs. The guide-plus-Discord action is rechecked with the external request intercepted. Test inputs are explicitly labelled demonstrations and only exist in an isolated browser context.

To reproduce the paired performance comparison, run `python3 scripts/prepare-design-comparison.py /path/to/the/prior-local-package.zip`, then `node scripts/measure-paired-design.mjs` (fourfold CPU slowdown) or `node scripts/measure-paired-design.mjs 1` (no additional CPU slowdown). It uses the prepared snapshot and current public files, serves both from memory on temporary localhost ports, and closes those servers after sampling. The timing report includes conditions and limitations. The final timing evidence is mixed: the home had severe stalls, while library and article median loads improved. The smaller payload is verified; a uniform speed improvement is not established. See the design report for every median and range.

Local lab observations are not field Core Web Vitals, a complete WCAG conformance statement or proof of ranking/citation gains. Search visibility cannot change until an explicitly authorised publication occurs.

The clipper journey check covers 18 light/dark layouts, native invite navigation, the retained guide-plus-Discord action, blocked/throwing popups, keyboard focus and no-JavaScript access. Interaction tests intercept the external destination; a separate live public Discord invite lookup confirms its server name. These checks do not sign in, join the server or validate private onboarding settings, and do not measure conversion lift.

## Remaining external dependencies

Campaign availability, commercial scope, rates and payout policies must be confirmed by the operator. No client statistics, testimonials, jobs, earnings benchmarks or case studies have been fabricated. The original reference ZIP/folder and the six supplied inspiration images remain untouched.

Instagram/Discord integrations were not exercised against live accounts. The supplied OAuth callback still depends on the bot/backend’s state binding, verification and token handling; presence of its source does not establish a configured or secure production integration. The HTML error escaping was checked locally, without provider requests. Review the full integration separately before any future publication. No new claim that it is operational is made.

The authenticated discovery app’s pre-existing working tree changes were left alone.
