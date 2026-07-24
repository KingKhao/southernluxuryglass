-- Customer inquiries from the "Inquire About This Piece" form
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Inquiry_email_idx" ON "Inquiry"("email");
CREATE INDEX "Inquiry_phone_idx" ON "Inquiry"("phone");
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");
