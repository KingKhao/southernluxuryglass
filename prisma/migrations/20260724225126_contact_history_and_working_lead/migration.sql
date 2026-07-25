-- New inquiry status
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'WORKING_LEAD' BEFORE 'SERIOUS_BUYER';

-- Permanent per-contact submission history (survives inquiry deletion)
CREATE TABLE "ContactHistory" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContactHistory_contactId_idx" ON "ContactHistory"("contactId");
ALTER TABLE "ContactHistory" ADD CONSTRAINT "ContactHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
