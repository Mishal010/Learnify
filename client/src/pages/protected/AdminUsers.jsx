import React from "react";
import Loader from "../Loader";
import { useAllUsers } from "../../hooks/queries/useAllUsers";
import { useDeleteUser } from "../../hooks/mutation/useDeleteUser";
import { useSearchParams } from "react-router-dom";

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "50");
  const { data, isLoading } = useAllUsers({ page, limit });
  const deleteUser = useDeleteUser();
  if (isLoading) return <Loader />;

  const users =
    data?.users ||
    data?.result ||
    data?.data?.result ||
    data?.data?.users ||
    [];

  const pagination = data?.pagination ||
    data?.data?.pagination ||
    (data?.meta
      ? { page: data.meta.page, totalPages: data.meta.totalPages }
      : null) || {
      page,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      total: users.length,
    };

  const updateParams = (newParams) => {
    const params = Object.fromEntries([...searchParams]);
    Object.assign(params, newParams);
    setSearchParams(params);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-3xl font-semibold mb-4">All Users</h1>

      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Joined</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : u.role === "teacher"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete this user? This action cannot be undone."
                        )
                      ) {
                        deleteUser.mutate({ id: u._id });
                      }
                    }}
                    disabled={deleteUser.isLoading}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination + limit selector */}
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {pagination.total || users.length}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value);
                updateParams({ limit: String(v), page: "1" });
              }}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <nav className="inline-flex -space-x-px" aria-label="Pagination">
          <button
            onClick={() =>
              updateParams({
                page: String(Math.max(1, page - 1)),
                limit: String(limit),
              })
            }
            disabled={!pagination.hasPrevPage || page <= 1}
            className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-l disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: Math.max(1, pagination.totalPages) }).map(
            (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() =>
                    updateParams({ page: String(p), limit: String(limit) })
                  }
                  aria-current={p === page}
                  className={`px-3 py-1 border-t border-b border-gray-300 text-sm ${
                    p === page ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  {p}
                </button>
              );
            }
          )}

          <button
            onClick={() =>
              updateParams({
                page: String(
                  Math.min(
                    pagination.totalPages || page + 1,
                    pagination.totalPages || page + 1
                  )
                ),
                limit: String(limit),
              })
            }
            disabled={
              !pagination.hasNextPage || page >= (pagination.totalPages || 1)
            }
            className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminUsers;
