# Official RiseKlix logo

The owner supplied `riseklix-logo_upscaled.png` on 8 October 2026 and identified it as the correct brand artwork. The source is copied unchanged to `docs/brand/riseklix-logo-source.png`; the file in Downloads remains untouched. The SHA-256 in `logo-assets.json` verifies that copy.

The apparent horizontal streaks in the attachment preview are RGB data in almost-transparent pixels. A normal browser alpha composite displays the supplied artwork cleanly. No generation, redesign, retouching, recoloring or background removal was performed.

The compact navigation uses the ribbon R cropped from that artwork beside the existing “clip / by RiseKlix” product label. The footer displays the full RiseKlix Agency lockup directly on the footer, with no backing, border or padding. At the owner’s request, the initial white backing was removed. In dark mode, CSS displays the lettering in white while leaving the colored ribbon unchanged; light mode uses the complete original artwork. Both layers reuse the same transparent PNG. The organization logo points to the complete lockup. Favicons and the Apple touch icon use the official R. The native campaign validation and confirmation pages use the same compact mark and browser icons.

`scripts/prepare-logo.mjs` records the crop boxes and reproduces the assets with Sharp: it trims transparent padding, scales the original pixels and pads the icons. Normal builds do not need Sharp and consume the prepared PNGs. The navbar asset is 15,615 bytes; the full footer lockup is 67,985 bytes and loads lazily. The original 686,398-byte upload is not downloaded by website visitors. Explicit image dimensions and fixed display sizes preserve the existing header heights. No JavaScript was added.

Verification on the local preview covered both themes at 1440, 820, 390 and 320 pixels, decoded navigation and footer images, control overlap, mobile menus, System dark mode without JavaScript, and narrow library/contact/article pages. All 124 generated pages were checked for the official image, browser icons and organization logo. Existing CSS equivalence/layout checks and mocked campaign checks passed; no live emails were sent. Compared with the previous art-repair package, all 124 main bodies, 75 editorial source files, the shared script and contact styles are unchanged.

Current transparent-footer checks: `transparent-footer-verification.json` (six explicit theme/layout combinations, both System themes without JavaScript, and all 124 footer templates). `logo-browser-verification.json` records the earlier implementation before the white backing was removed.

Evidence: `logo-assets.json`, `logo-browser-verification.json`, `logo-integrity.json`, `../design-assets-verification.json`, and `../campaign-api-verification.json`. Local screenshots are in `../screenshots/logo/`.

This is a local revision. The hosted website was not changed; indexing, rankings, AI citations and field performance were not measured.
