# Card design refresh — 2026-11-02

## Change

Refreshed all currently rendered card families while retaining the red/charcoal industrial identity and the supplied company-content correction. Added `dist/cards.css` after the existing layout stylesheet on all eight entry points.

- Service cards: consistent image proportions, smaller diagonal red icon corners, readable copy, bottom-aligned labeled action, one full-card destination instead of repeated links.
- Previous-work cards: distinct type context, consistent image/copy/action hierarchy, clear illustrative-photo labels, horizontal home layout on desktop and stacked project layout on mobile. Related entries remain scrollable.
- Quick service/category strips, filters, about preview, value band, advantage panels and brand strip: consistent border/radius/spacing, less visual noise, hover only where actionable.
- Service-detail sidebar, FAQ accordions, gallery tiles, contact info/form/quote/location panels and career pending state: coordinated typography and padding, gentle borders, restrained color, intentional dark panels.
- Keyboard focus remains visible over the whole linked card. Arabic action arrows point left; English arrows point right. Reduced motion disables card transitions.

## Validation

- `npm test`: 11 tests pass, covering both-language page rendering, local assets/links, source-backed business facts, exclusion of invented claims, search/filter behavior, image file budgets, disabled unconfirmed contact sending, and one named destination per service/project card.
- `node --check dist/app.js`: passes.
- No photo assets or fonts were added, and the responsive compressed WebP variants remain in use.
- Browser review could not run: the supported browser tool reports “Local browser use is disabled in Work settings.” No alternate browser automation was used. Desktop/mobile rendering and interaction checks for this specific card update remain unverified.
- Local HTTP preview returns 200 for `cards.css`, and all eight entry points reference it after `style.css`.

## Publication

The update is local and has not been published. `get_site` for the existing project `appgprj_6ae7765cdbb4819180f27e019dd4588e` returns `project_not_found`, and `list_sites` returns no accessible sites. The existing identity and audience were preserved; no replacement site or deployment was created.

## Content handoff included

`CONTENT_UPDATES_NEEDED.md` contains the remaining official contact details, project scope/dates/images, optional company counts/team/testimonials, actual vacancies, warranty terms, brand relationships, source photos and legal text to supply. The previous audit is retained as historical evidence, not a claim about the refreshed content.
