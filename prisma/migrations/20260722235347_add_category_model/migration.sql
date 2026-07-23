-- Create the Category table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Seed categories from the distinct category strings already on products,
-- ordered alphabetically so the initial order is sensible.
INSERT INTO "Category" ("id", "name", "sortOrder", "createdAt")
SELECT gen_random_uuid()::text,
       c.category,
       (row_number() OVER (ORDER BY c.category)) - 1,
       CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "category" FROM "Product") c;

-- Link products to the new Category rows
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

UPDATE "Product" p
SET "categoryId" = cat."id"
FROM "Category" cat
WHERE p."category" = cat."name";

ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Product"
    ADD CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old free-text column
ALTER TABLE "Product" DROP COLUMN "category";
