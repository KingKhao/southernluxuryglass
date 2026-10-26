# Southern Luxury Glass — preserved storefront identity

## Authority and scope
Existing production storefront, checked October 26, 2026. Kevin explicitly requested functions, features and motion improvements while retaining the colors and style. This is an experience refinement, not a rebrand.

- Cream `#FAF6EE`, ivory `#F3ECDD`, charcoal `#2A2621`.
- Emerald `#2F4A3D`, dark emerald `#1F332A`, light emerald `#3F5F4E`.
- Gold accent `#B08D57`, light gold `#C7A876`, readable gold text `#7D5F30`.
- Playfair Display for headings, Lato for body and controls.
- Existing rounded product cards, portrait photographs, pill controls and calm editorial spacing remain.

## Experience contract
The gallery is for discovering, saving and asking about real pieces. It is not an online checkout. Crystal arranges purchases personally through the existing invoice process. Sold pieces cannot receive a purchase inquiry. Reserved pieces keep their established inquiry option. No invented ratings, urgency, prices, availability or delivery promises.

Search accepts name, description, category, maker, era and condition. Filters compose with saved and available-only states. Sorting preserves arrival order by default and never mutates source data. URLs share filters; saved lists stay on the visitor's device. Empty states provide a clear reset path.

On phones, search remains visible while additional refinements collapse behind an explicit control. Photo viewing supports fit, zoom, thumbnails, arrows and touch swipes. Keyboard focus stays within dialogs, Escape closes the top dialog, and background scrolling locks until the last dialog closes.

## Motion
Use `--slg-ease-out: cubic-bezier(0.23, 1, 0.32, 1)` with 160ms feedback, 240ms overlay entry, 280ms fine-pointer photo hover and a 450ms bounded homepage reveal. No background animation loop or new animation library. Search and sorting remain immediate; no replaying grid choreography on every keystroke. Respect reduced motion, preserve visible content without JavaScript, and gate hover transforms to fine pointers.

## Verification boundary
Browser tests use a production-mode local build backed by public-listing fixtures, not the protected live database. API submissions are intercepted. Physical phone gestures, the actual software keyboard and live message delivery still require their own verification. No production rollout is included in this branch.
