-- Inquiry label: New (default) or Serious Buyer
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'SERIOUS_BUYER');
ALTER TABLE "Inquiry" ADD COLUMN "status" "InquiryStatus" NOT NULL DEFAULT 'NEW';
