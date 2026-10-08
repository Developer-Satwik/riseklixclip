# Make joining Discord easy for clippers

Research and local verification: 8 October 2026. Baseline: Git commit `2598d216b5415c6bda1801b1b8a65fb307618ed8`. This revision changes the website's entry journey. It does not change Discord's server configuration.

## What the existing journey made difficult

The header advertised “Start a campaign” but had no clipper action. On the homepage, “I want to clip” was a quieter text link alongside the filled campaign button. Its destination was the beginner guide, with Discord opened through JavaScript in a second tab. A person looking for a community could therefore miss the action or read a long guide before finding an ordinary invitation link. The later audience card also prioritized the guide over the invite.

These are observations from the website's source and rendered local pages, not recorded user behavior. There is no baseline conversion study, click analytics or measured join rate in this revision.

## Research and decisions

### Say what the action does

[Nielsen Norman Group's link-label guidance](https://www.nngroup.com/articles/better-link-labels/) recommends labels that convey the destination clearly and remain meaningful when scanned on their own. Its [information-architecture analysis](https://www.nngroup.com/articles/3-ia-mistakes/) explains how unclear labels and navigation structures impede finding content. Applied here, “Join Discord” communicates a concrete destination more directly than “I want to clip”.

Decision: use explicit invitation labels, with “For clippers” context where space permits. Keep the campaign-owner route easy to find. The inference is that clearer labels and placement reduce discovery friction; the sources do not establish a conversion uplift for RiseKlix.

### Make the invitation the entry point

Discord's [joining instructions](https://support.discord.com/hc/en-us/articles/360034842871-How-do-I-join-a-Server) describe joining through an invitation and accepting it in Discord. Its [invitation guide](https://support.discord.com/hc/en-us/articles/204155938-How-do-I-invite-friends-to-my-server) explains invitation links and how the originating channel affects arrival. The website should make that invitation available directly instead of requiring a website application or full tutorial first.

Decision: shared header, footer and contextual buttons are ordinary links to `https://discord.gg/skQk3xZcRa`. They navigate directly in the current tab and work without JavaScript. The researched guide remains available for visitors who want preparation.

### Explain the first few steps without inventing server details

Discord's [Community Onboarding FAQ](https://support.discord.com/hc/en-us/articles/11074987197975-Community-Onboarding-FAQ) describes how server owners can use questions and default channels to help members orient themselves. Those settings belong to the server and cannot be established by a website redesign.

Decision: the website offers three truthful, generic steps: accept the invitation after checking the server name; follow welcome instructions and rules; then confirm a campaign's requirements before editing. No particular channel name, available job count, payout promise or automatic role assignment is asserted. The public invitation lookup confirmed the server name, not its private onboarding configuration.

### Keep the requested two-destination action understandable

[W3C's change-on-request explanation](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html) discusses predictable context changes, including informing people when actions open new windows. The owner previously requested that the clipper action open Discord while retaining the intended website page.

Decision: preserve that behavior in the homepage hero and contact page, add a visible explanation and screen-reader notice, and catch a rejected popup attempt without interrupting normal navigation to the guide. The guide's top invitation is the fallback. Direct invitations elsewhere avoid reliance on popup permission. Modified clicks retain normal browser link behavior.

### Make the action visible on mobile and usable by keyboard

[WCAG 2.2 target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) specifies a 24-by-24 CSS-pixel minimum subject to spacing and other exceptions. This revision uses a more generous minimum of 44 pixels in height for important join actions. [Focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) addresses keeping focused controls visible.

Decision: put the header invitation outside the collapsed navigation. On small screens it gets a full-width row, and the hero clipper action appears before the campaign action. The open menu starts below the header rather than covering its invite. Existing keyboard focus styles and Escape behavior remain. These checks cover specific controls and layouts; they are not a complete WCAG conformance assessment.

## Implemented entry points

| Location | Action and purpose |
| --- | --- |
| Header, all 130 pages | Visible direct invitation; accessible label identifies clippers; outside the mobile menu. |
| Homepage hero | Filled “Join Discord & start clipping” action; guide in current tab plus invitation in new tab, with advance explanation. |
| Immediately after the hero | Direct invite, optional beginner guide and three steps that explain what happens next. |
| Homepage clipper audience card and closing section | Direct invitation at later decision points. |
| Beginner guide, before its reading tools | Join before reading the full article; direct fallback when a second tab cannot open. |
| 20 selected clipper articles | Contextual next-step invitation after the authored article content. |
| Campaign contact page | Clearly separate clipper route, direct invitation and explained guide-plus-Discord option. |
| Footer, all 130 pages | Filled invitation for readers who finish a page. |

The invitations use the existing violet semantic accent with white text and preserve neutral light/charcoal surfaces, Inter and System/Light/Dark. The official logo, transparent footer artwork and collage assets are unchanged.

## Verification and payload

`docs/clipper-entry-verification.json` records the focused journey checks. Eighteen layouts cover light and dark modes at widths 1440, 1101, 1100, 1000, 821, 820, 560, 390 and 320. Checks cover initial visibility, target height, horizontal overflow, keyboard focus, menu overlap, direct navigation, the retained two-destination flow, blocked/throwing popups and no-JavaScript access. The all-page check in `docs/verification.json` passed for 130 routes and verified every authored paragraph across 119 articles.

Interaction checks intercept the external invitation so they do not accept membership or perform account actions. A separate live public lookup returned HTTP 200 for `skQk3xZcRa`, with server name “Clip by RiseKlix” and no expiry timestamp. This confirms validity at the check time; it does not guarantee future invitation availability.

| Asset | Previous bytes | Current bytes | Gzip increase |
| --- | ---: | ---: | ---: |
| Shared stylesheet | 58,279 | 59,962 | 340 |
| Page-specific entry stylesheet | 0 | 3,280 | 930 |
| Shared script | 15,481 | 15,558 | 40 |

The entry stylesheet loads only on the homepage and 20 selected articles. Other pages receive the small shared change. No new images, fonts, third-party JavaScript, Discord iframe or additional continuous animation were introduced. Gzip figures are local compression measurements, not observed CDN transfer sizes or field Core Web Vitals. The existing shared budgets remain under 60,000 CSS bytes and 16,000 script bytes.

## Preservation and remaining uncertainty

The 119 authored articles, their titles and search metadata, canonical URLs, structured data, routes, campaign backend and media assets are preserved. Article editorial dates were not changed for this CTA revision. Source/file comparison is recorded in `docs/clipper-entry-preservation.json`.

Website discovery and navigation are verified locally. Private Discord welcome screens, permissions, channel availability, account sign-in and actual membership acceptance have not been tested. No server administration or live campaign availability changes were made. Conversion and search/citation improvements are not established by these checks. To evaluate the result later, the operator can compare clipper CTA usage and actual server joins over equivalent traffic periods while accounting for invitation sharing and campaign availability; tracking was not added in this revision.
