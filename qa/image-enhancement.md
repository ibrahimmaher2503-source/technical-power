# Image quality and delivery

The original photographic assets are restored from 16 distinct screenshot crops using the built-in imagegen tool. Three near-identical crops share a restored master, and the old water-large file becomes the large water variant. The original logo is retained to preserve exact brand geometry.

Prompt set: restore the same photograph at high resolution, preserve camera framing, colors, people, poses, equipment and the red industrial treatment. Reduce blur and compression artifacts. Remove only website UI fragments embedded in the crops (Before/After badges, clipped captions, decorative corners and the expand button). Portrait prompts require identity preservation and forbid beautification or age/expression changes. Office signage and genuine equipment labels are requested unchanged. These are AI restorations; fine faces, wiring and markings may differ from the low-resolution source and must not be treated as engineering evidence or verified staff portraits.

The generated master filenames are recorded in `image-enhancement-sources.json`; master PNGs remain in the local Codex generated-images directory, outside the deployed site. Re-export with `python scripts/optimize-images.py <master-directory>`. This requires Pillow, already present in the working environment.

Every photo is shipped in 320, 640 and 1280 px WebP variants, bounded at 22,000 / 60,000 / 180,000 bytes respectively. `srcset` with lazy auto sizing selects the appropriate image for each rendered card. Large gallery images are requested only when opened. CSS heroes use 640 px on mobile and 1280 px on larger displays, with matching conditional preload hints. Existing lazy loading remains enabled; decoding is asynchronous.

`image-sizes.json` records actual dimensions, bytes and compression quality for every export. The exporter verifies decoding and dimensions, and the Node test suite checks all file budgets and responsive references.
