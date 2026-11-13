# Technical Power — bilingual website UI

Eight independently addressable responsive pages built with standard HTML, CSS, and JavaScript. No package installation or build step is required. All fonts and imagery are local.

Run `npm run dev`, then open http://localhost:5173. Run `npm test` for the small rendering/filter/search checks.

Pages: `index.html`, `about.html`, `services.html`, `service.html?id=maintenance`, `projects.html`, `project.html?id=water-treatment`, `careers.html`, and `contact.html`. Service/project cards open the appropriate detail content. AR/EN switches the complete interface between separate Arabic and English content and persists in the browser. Search, previous-work category filters, accordions, mobile menu, gallery, and contact validation are implemented. Previous work now lists only the four entries supplied in the company material, without invented years, status or results.

Contact sending is disabled until an official recipient is supplied. Unconfirmed contact details, office map, staff, testimonials, jobs, metrics and historical events have been removed from the UI. Careers and contact sections use neutral pending states. Social buttons explain that official links are pending. Fill in `CONTENT_UPDATES_NEEDED.md` to complete these fields; the previous inventory remains in `qa/content-verification-2026-11-01.md`.

The original imagery was extracted from the supplied reference screenshots. Photographs have now been restored with imagegen and exported as responsive WebP files (320/640/1280 px); the original logo is retained. Master PNGs stay outside the deployed site. See `qa/image-enhancement.md` for source prompts, export details, file budgets, and the limits of AI restoration. Original high-resolution photos and a vector logo remain preferable for exact production fidelity. The company screenshots supplied later are the source for business content. Brand names identify supplied products and do not imply an authorized partnership. Previous-work images are explicitly labeled illustrative. Legal dialogs are review notices, not finalized legal policies.

`DESIGN.md` records the reference-driven design and scope. `qa/` holds the verification report. `.openai/hosting.json` stores the private Sites project identity; no credentials belong in the repository.

`dist/cards.css` defines the refreshed card system across all eight pages: stable image ratios, white surfaces, restrained borders/shadows, full-card service/project links, logical RTL/LTR spacing, visible focus, and responsive compact layouts. Browser validation for the latest card update is unavailable because local browser use is disabled in Work settings.
