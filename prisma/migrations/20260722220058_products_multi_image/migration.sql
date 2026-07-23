-- Add the new images array column (empty default)
ALTER TABLE "Product" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preserve existing single image URLs by copying each into the images array
UPDATE "Product"
SET "images" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL AND "imageUrl" <> '';

-- Drop the old single-image column
ALTER TABLE "Product" DROP COLUMN "imageUrl";
