# Technical Power — bilingual website UI

Eight independently addressable responsive pages built with standard HTML, CSS, and JavaScript. No package installation or build step is required. All fonts and imagery are local.

Run `npm run dev`, then open http://localhost:5173. Run `npm test` for the small rendering/filter/search checks.

Pages: `index.html`, `about.html`, `services.html`, `service.html?id=maintenance`, `projects.html`, `project.html?id=water-treatment`, `careers.html`, and `contact.html`. Service/project cards open the appropriate detail content. AR/EN switches the complete interface between separate Arabic and English content and persists in the browser. Search, project category filters and pagination, job filters, accordions, mobile menu, gallery, and contact validation are implemented.

Contact opens a populated draft in the visitor's email application. Career links open an application email and ask the visitor to attach their CV. No message is sent or CV uploaded by this static UI. Social account URLs have not been provided; their buttons explain this instead of linking to unrelated profiles. The map is a styled area-map illustration linking to a Google Maps area search, not an exact verified office pin.

The original imagery was extracted from the supplied reference screenshots. Photographs have now been restored with imagegen and exported as responsive WebP files (320/640/1280 px); the original logo is retained. Master PNGs stay outside the deployed site. See `qa/image-enhancement.md` for source prompts, export details, file budgets, and the limits of AI restoration. Original high-resolution photos and a vector logo remain preferable for exact production fidelity. Names, contact details, stats, partner names, testimonials, project outcomes, and job openings reproduce or expand the reference UI and require company approval before public use. Legal dialogs are review notices, not finalized legal policies.

`DESIGN.md` records the reference-driven design and scope. `qa/` holds the verification report. `.openai/hosting.json` stores the private Sites project identity; no credentials belong in the repository.
