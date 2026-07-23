"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  productCount: number;
};

export default function CategoriesTable({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const categories = [...initialCategories].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create category.");
        return;
      }
      setNewName("");
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const saveRename = async (id: string) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    setEditingId(null);
    router.refresh();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const current = categories[index];
    const target = categories[index + direction];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/categories/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/categories/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Its products must be moved or removed first.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete category.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="rounded-md border border-emerald/30 bg-white/70 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-emerald px-5 py-2 text-sm text-cream hover:bg-emerald-dark disabled:opacity-50"
        >
          + Add Category
        </button>
        {error && <span className="self-center text-sm text-red-700">{error}</span>}
      </form>

      <div className="overflow-x-auto rounded-lg border border-emerald/15 bg-white/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-emerald/15 text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b border-emerald/10 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded border border-emerald/30 px-2 text-emerald disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === categories.length - 1}
                      aria-label="Move down"
                      className="rounded border border-emerald/30 px-2 text-emerald disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => saveRename(category.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(category.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="rounded-md border border-emerald/30 bg-white px-2 py-1"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                      className="font-medium text-charcoal hover:text-emerald hover:underline"
                      title="Click to rename"
                    >
                      {category.name}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-charcoal/70">{category.productCount}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-charcoal/60">
                  No categories yet. Add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-charcoal/50">
        Click a name to rename it. Use the arrows to change the order they appear in on the gallery.
      </p>
    </div>
  );
}
