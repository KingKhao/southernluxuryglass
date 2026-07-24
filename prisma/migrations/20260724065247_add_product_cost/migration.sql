-- Admin-only cost field (what Crystal paid); nullable, never shown on storefront
ALTER TABLE "Product" ADD COLUMN "cost" DOUBLE PRECISION;
