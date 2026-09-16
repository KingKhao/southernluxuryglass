-- DropIndex
DROP INDEX "Contact_email_idx";

-- CreateIndex
-- Backs recordContactSubmission()'s upsert-by-email in src/lib/contacts.ts —
-- without this, concurrent submissions for the same email could each pass a
-- check-then-act read and both create a row (verified no duplicate emails
-- exist prior to adding this constraint).
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
