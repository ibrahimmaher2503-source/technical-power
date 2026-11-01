# UI verification — 2026-11-01

- `npm test`: 7 tests pass. Covers both separate locales on all eight page templates, local link/asset integrity, project pagination/category filters, combined job filters/empty state, search and query escaping, unknown detail identifiers, required contact fields, and home section order.
- `node --check dist/app.js`: passes.
- Browser: all eight pages checked in Arabic RTL and English LTR at desktop width 1366 and mobile width 390 (32 page/locale/viewport combinations). One h1 per page, no document horizontal overflow, no broken loaded images, no unnamed links/buttons in the Arabic desktop check.
- Additional English checks at widths 320 and 768 for Home, Services, Project Details, and Contact: no document horizontal overflow.
- Real browser interactions: water project filter returns two projects; page 2 returns six distinct projects; transformer search resolves the relevant project; engineering+Cairo job filters return one job; part-time produces the resettable empty state; FAQ expands; project image opens/closes in a dialog; mobile menu expands; quote link preselects the quote inquiry; empty contact submission remains blocked with no success status.
- Visual review: Arabic home desktop/mobile and contact mobile; corrected hero geometry in RTL, compacted the testimonial and about preview, removed pre-existing status badges from extracted photography, and added accessible names to compact service links.

## Spacing and language correction

- Render only the selected language in every localized element; no stacked translations. Language toggle changes page content, navigation, buttons, form labels, and text direction while retaining the current route.
- Rebalanced hero height, section spacing, image heights, card content padding, and heading alignment. Statistics follow the About preview; core services use a full-width heading and grid. Header uses a menu below 1024px, and the mobile About preview stacks its photo and text.
- Rechecked all eight pages in both languages at widths 390, 768, and 1366: 48 combinations, zero horizontal-overflow, mixed-locale, or broken-loaded-image findings. Reviewed the Arabic desktop homepage and both language versions at the actual preview size.

Limits: no actual email was sent; no CV was uploaded; no physical-device or assistive-technology session was run. Company contact details, sample jobs, partner relationships, testimonials, project metrics, and legal text are not verified business facts. Photo resolution is limited by the supplied screenshot crops. The styled map links to an area search; it does not establish an exact office location. This is a static UI implementation, not a backend/CMS.

## Image enhancement

- Restored the photographic assets from 16 distinct source crops using imagegen, with three shared masters for near-identical crops. Logo remains original.
- Exported 57 WebP variants: 19 each at 320, 640 and 1280 px. Small variants average 14 KB; standard variants average 43 KB; largest file is about 175 KB. Total deployed photographic files: 3.35 MiB across all sizes; each image element selects one size.
- Matching hero preload/media rules, responsive `srcset` and lazy auto sizing, asynchronous decoding, and larger images on gallery open.
- `npm test`: 8/8 pass, including image variant existence and byte budgets. Exporter verified every output image's format and dimensions.
- Browser reviewed all eight pages at the actual preview viewport: no broken loaded images, no horizontal overflow, all main photographs responsive. Confirmed actual selection of small card variants and large About image; confirmed enlarged water gallery loads `water-large.webp`.
- AI enhancement reconstructs details from tiny sources and cannot certify exact facial identity, wiring, equipment markings or office signage. No network-speed or physical-device benchmark was run.
