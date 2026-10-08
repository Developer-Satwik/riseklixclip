# Button design and interaction research — 8 October 2026

The review covers the shared website controls and their light, charcoal dark, mouse, touch and keyboard states. This is a design-system comparison and local implementation review. It is not a survey measuring industry adoption, a conversion experiment or evidence of search-ranking improvements.

## Current patterns and what fits this website

| Primary source reviewed | Finding | Decision for RiseKlix |
| --- | --- | --- |
| [Google Design: Material 3 Expressive research](https://design.google/library/expressive-material-design-google-research) | Contemporary expressive systems use shape, size, color and containment to direct attention. Google also reports that removing familiar patterns or text labels harmed usability in its experiments. | Add personality through a consistent soft square shape and a contained arrow detail. Retain descriptive labels, familiar navigation and clear campaign/clipper choices. Google's app-study results do not predict this site's conversion rate. |
| [Carbon button guidelines](https://www.carbondesignsystem.com/building-blocks/core/components/button/guidelines) and [specifications](https://www.carbondesignsystem.com/building-blocks/core/components/button/specifications), updated 30 September 2026 | Consistent emphasis distinguishes principal actions from optional controls; the system specifies separate hover, focus, active and disabled tokens. | Use filled neutral campaign actions, violet Discord actions, outlined supporting actions and quiet utilities. Apply the same state language across pages, with the two audience choices retained in the home hero. |
| [NN/g: Button states communicate interaction](https://www.nngroup.com/articles/button-states-communicate-interaction/), 25 April 2025 | Hover, keyboard focus and pressed feedback serve different purposes. An outline makes focus identifiable; unavailable controls should not react as enabled controls do. Loading needs a clear indication. | Add restrained hover changes and immediate pressed feedback, keep an explicit focus ring and a readable disabled surface. Preserve the enquiry form's native disabled behavior and existing “Sending enquiry…” label. |
| [W3C: Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | WCAG 2.2 AA generally requires 24 × 24 CSS pixels, with documented exceptions. Larger targets are useful for important controls. | Aim for at least 44-pixel target height on the action controls being refined, and 44 × 44 for search and close icons. This choice exceeds the AA minimum; it is not a claim that AA requires 44 pixels or a complete conformance audit. |
| [W3C: Focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Keyboard users need to identify which element currently has focus. | Keep a visible three-pixel outline, with an inset ring in the clipped library view group. |
| [MDN: hover media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/hover) | The primary pointer may not conveniently hover; touch can emulate hover awkwardly. | Gate decorative hover treatment to a hover-capable fine pointer. Touch gets pressed feedback; all labels and controls stay available without hovering. |

## Observed baseline

The recorded local samples are in `button-ui-baseline.json`: homepage at 320, 390 and 1440 pixels, library and contact at 390 pixels. Existing styles mixed 2-, 4-, 100-pixel and circular corners. CTA buttons and resource cards lifted on mouse hover, moving their pointer targets; neutral primary and outlined buttons had little surface feedback. Mobile search had a 32-pixel-wide target; resource Save controls were 34 pixels tall, reader utilities 38, framing utilities 40 and library switches 42. Violet buttons already had a hover color, but it was not scoped to pointer capability.

## Implemented direction

- Shared actions use a 10-pixel corner radius; compact utilities use seven pixels. Filled controls have a small inset edge and restrained shadow, while outlined and quiet controls have lower visual emphasis.
- CTA arrows sit in a small translucent square. On mouse hover they move two pixels diagonally. Button boxes and resource cards stay stationary so their action targets do not move.
- Neutral, white and violet filled actions have separate hover and pressed surfaces. Outlined and quiet actions gain a tonal surface; pressed utility controls show an inset edge.
- Existing `aria-pressed` toggles retain their semantics, with a visible inset selection mark on view/format/example controls. Saving retains its visible check and label feedback.
- Refined utility targets have a minimum height of 44 pixels. Search and modal Close are 44 × 44, including narrow phones. Mobile Menu spacing is tightened to accommodate the larger search target within the existing header row.
- Native disabled form buttons have a readable neutral surface and no hover animation. The enquiry form's busy state keeps its wait cursor and status message. Its existing script now restores the original button child nodes after sending, retaining the decorative arrow's styling and accessible markup on recovery.
- Reduced-motion users retain state feedback with transitions and arrow travel removed. Forced-color users get system borders, focus and selection outlines.
- The implementation is a small shared CSS layer loaded after the existing styles on every route. No interaction script, font, image or dependency is added. Content, metadata, structured data, destinations and the guide-plus-Discord behavior are preserved.

## Verification

The final measurements and executed checks are recorded in `button-ui-verification.json`; preservation is recorded separately in `button-ui-preservation.json`.

- Forty responsive layout cases cover the home, library, contact and beginner guide at 320, 390, 820, 1100 and 1440 pixels in both themes. Header controls do not overlap; sampled rendered actions meet the 44-pixel height target.
- Forty-eight button-family comparisons cover enabled, hover, pressed and keyboard-focus states. Sampled enabled text contrast is at least 5.47:1; sending-state labels are 5.25:1 in light and 7.13:1 in dark. Contrast is computed over CSS ancestor surfaces, not artwork pixels. Filled hero buttons are opaque.
- Example selection, framing formats, saved resources and the library filter work with the keyboard. Search closes with Enter and returns focus to its opener. Native contents and FAQ disclosures remain usable.
- A trusted emulated touch sequence confirms painted tap feedback; hover treatment remains absent on the coarse pointer. The test cancels the campaign destination to inspect that feedback. Reduced motion, forced colors and no-JavaScript native links pass.
- An isolated, explicitly labeled mocked enquiry exercises the real busy and recovery UI. The disabled surface does not react to hover; its opacity stays at one; recovery restores the original decorative arrow markup and retained answers. No live enquiry or email is sent.
- The all-page/content verification passes for 130 pages and 119 authored articles. Framing/search and campaign-browser checks pass. The scroll check passes all sixteen layouts plus deep links, history, FAQ height, geometry caching and static fallbacks. Its native picker fixture now focuses the select before choosing a value, matching real interaction; button state snapshots wait for incidental smooth scrolling to settle before comparing positions.
- The new stylesheet is 6,391 bytes, or 1,571 bytes with Node's gzip calculation. The shared script's compressed size is unchanged. There are no added images, fonts, interaction scripts or libraries; the existing enquiry module has a small markup-restoration change.
- Every generated HTML file matches the prior commit after removing the new stylesheet link and replacing the shared-script cache version. All article bodies, button labels, destinations, metadata and schema are preserved; 128 protected source/media/backend files retain their bytes.

These records describe local Chromium evidence and compressed file sizes. They do not establish field Core Web Vitals, conversion lift, complete accessibility conformance, Safari/iOS execution, production deployment status or ranking/citation gains.
