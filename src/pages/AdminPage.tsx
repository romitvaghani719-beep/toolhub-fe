import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserSchema } from "@toolhub/shared";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  useAdminUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useAdminUsers({
    page,
    search: debouncedSearch || undefined,
  });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const isEditing = Boolean(editingUserId);
  type AdminUserFormValues = {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "user";
  };
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminUserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: { role: "user", name: "", email: "", password: "" },
  });

  function openCreateModal() {
    setEditingUserId(null);
    reset({ name: "", email: "", password: "", role: "user" });
    setIsModalOpen(true);
  }

  function openEditModal(user: { id: string; name: string; email: string; role: "admin" | "user" }) {
    setEditingUserId(user.id);
    reset({ name: user.name, email: user.email, password: "", role: user.role });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUserId(null);
  }

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Admin panel</h1>
          <p style={{ color: "var(--text-3)", margin: "4px 0 0" }}>Manage users</p>
        </div>
        <Button onClick={openCreateModal} className="page-header__action">
          <Plus size={16} />
          Create user
        </Button>
      </div>

      <input
        className="input mb-4"
        placeholder="Search users…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {isLoading && (
        <div className="card">
          <LoadingSpinner />
        </div>
      )}
      {isError && <div className="empty card">{(error as Error).message}</div>}

      {!isLoading && data && (
        <>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="select"
                      value={u.role}
                      onChange={(e) =>
                        updateUser.mutate({
                          id: u.id,
                          role: e.target.value as "admin" | "user",
                        })
                      }
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => openEditModal(u)}
                        aria-label="Edit user"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => deleteUser.mutate(u.id)}
                        aria-label="Delete user"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card card card--pad" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>
              {isEditing ? "Update user" : "Create user"}
            </h2>
            <form
              onSubmit={handleSubmit((formData) => {
                if (isEditing && editingUserId) {
                  updateUser.mutate(
                    {
                      id: editingUserId,
                      name: formData.name,
                      email: formData.email,
                      role: formData.role,
                      ...(formData.password ? { password: formData.password } : {}),
                    },
                    { onSuccess: closeModal },
                  );
                  return;
                }
                createUser.mutate(formData, { onSuccess: closeModal });
              })}
            >
              <div className="field-row">
                <div className="field">
                  <label className="field__label">Name</label>
                  <input className="input w-full" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div className="field">
                  <label className="field__label">Email</label>
                  <input className="input w-full" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field__label">Password</label>
                  <input className="input w-full" type="password" {...register("password")} />
                </div>
                <div className="field">
                  <label className="field__label">Role</label>
                  <select className="select w-full" {...register("role")}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                  {isEditing ? "Update user" : "Create user"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
