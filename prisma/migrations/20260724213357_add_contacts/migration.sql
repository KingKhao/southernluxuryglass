-- CRM contacts + notes
CREATE TYPE "ContactCategory" AS ENUM ('NEW', 'FOLLOWER', 'BUYER', 'B2B');

CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "productOfInterest" TEXT,
    "category" "ContactCategory" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Contact_email_idx" ON "Contact"("email");
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

CREATE TABLE "ContactNote" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactNote_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ContactNote" ADD CONSTRAINT "ContactNote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
