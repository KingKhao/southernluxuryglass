import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Add Product</h1>
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </div>
  );
}
