import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, createCategory, deleteCategory, listCategories, updateCategory } from "../../lib/api";
import type { Category } from "../../lib/api";

export function AdminCategories({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  const load = () => {
    if (!token) return;
    setLoading(true);
    listCategories(token)
      .then(res => setCategories(res.categories))
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load categories.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleDelete = async (category: Category) => {
    if (!token) return;
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    setBusyId(category.id);
    try {
      await deleteCategory(token, category.id);
      setCategories(prev => prev.filter(c => c.id !== category.id));
      showToast(`Category "${category.name}" deleted.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete category.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Category Management</h2>
          <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setEditing("new")}><Plus size={14} /> Add Category</Btn>
      </div>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No categories yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f6f4f0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-[#faf9f7] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(c)} disabled={busyId === c.id}
                          className="p-1.5 rounded hover:bg-[#edeae3] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(c)} disabled={busyId === c.id}
                          className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editing && token && (
        <EditCategoryModal
          category={editing === "new" ? null : editing}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={saved => {
            setCategories(prev => {
              const exists = prev.some(c => c.id === saved.id);
              return exists ? prev.map(c => (c.id === saved.id ? saved : c)) : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
            });
            setEditing(null);
            showToast(editing === "new" ? "Category created." : "Category updated.", "success");
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function EditCategoryModal({ category, token, onClose, onSaved, showToast }: {
  category: Category | null;
  token: string;
  onClose: () => void;
  onSaved: (c: Category) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = category ? await updateCategory(token, category.id, name) : await createCategory(token, name);
      onSaved(res.category);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <Card className="w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{category ? "Edit Category" : "Add Category"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Category Name</label>
            <input required autoFocus value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div className="flex gap-2 pt-2">
            <Btn type="submit" variant="primary" disabled={saving} className="flex-1 justify-center">
              {saving ? "Saving..." : "Save"}
            </Btn>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}
