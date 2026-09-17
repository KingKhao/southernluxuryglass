-- AlterTable
ALTER TABLE "Contact"
  ADD COLUMN "smsConsent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "smsConsentVersion" TEXT,
  ADD COLUMN "smsConsentAt" TIMESTAMP(3);
