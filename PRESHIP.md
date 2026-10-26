# Release safeguards — October 26, 2026

Real catalog: submissions are intentional customer records; use synthetic details only in an isolated fixture environment. Crystal operates from Morristown, Tennessee; the existing Contact form handles privacy requests. Full contact erasure now includes matching inquiries and cascading history/notes, but was not executed on production. Published policy drafts still need appropriate human review. Future outbound marketing requires an actual sender/suppression review; this release enables no mailing or SMS service.

Release checklist:

- Preserve the existing color/design direction; changes here address demo safety, accessibility, dependencies and security.
- Check desktop/mobile, keyboard focus, dialogs, reduced motion, form errors and mock-success wording.
- Keep the asset register and CVD credit. No certification/blanket compliance claim.
- Recheck secrets and ignore rules before pushing. Public Git history must not include private records or credentials.
- Review remote font/photo requests whenever adding third parties; never claim zero data processing solely because a form is mocked.
- Only approved business facts should appear as operational claims. Real-owner permissions and professional policy review cannot be created by code.

## Technical verification

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:security`, and `npm run build`. Glass additionally provides `npm run test:storefront`.

Builds generate the Prisma client but **do not run database migrations**. Schema changes require an explicit owner-controlled `npm run db:deploy`. No schema migration is needed for this release. Revocable admin sessions use the existing Setting table, and old cookies require a fresh login. Never deploy local fixture/prebuilt artifacts; deploy source through the normal host build.
