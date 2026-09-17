-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- AlterTable
ALTER TABLE "Product"
  ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
  ADD COLUMN "dimensions" TEXT,
  ADD COLUMN "era" TEXT,
  ADD COLUMN "condition" TEXT,
  ADD COLUMN "maker" TEXT;
