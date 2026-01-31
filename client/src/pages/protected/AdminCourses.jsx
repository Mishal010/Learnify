import React from "react";
import Loader from "../Loader";
import { useCourses } from "../../hooks/queries/useCourses";
import { useDeleteCourse } from "../../hooks/mutation/useDeleteCourse";
import { useSearchParams } from "react-router-dom";

const AdminCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "50");
  const { data, isLoading } = useCourses({ page, limit });
  const deleteCourse = useDeleteCourse();
  if (isLoading) return <Loader />;

  const courses =
    data?.courses || data?.result || data?.data?.result || data?.data?.courses || [];

  const pagination =
    data?.pagination || data?.data?.pagination ||
    (data?.meta ? { page: data.meta.page, totalPages: data.meta.totalPages } : null) ||
    { page, totalPages: 1, hasNextPage: false, hasPrevPage: false, total: courses.length };

  const updateParams = (newParams) => {
    const params = Object.fromEntries([...searchParams]);
    Object.assign(params, newParams);
    setSearchParams(params);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-3xl font-semibold mb-4">All Courses</h1>
      <div className="bg-white shadow rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((c, idx) => (
              <tr key={c._id || idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={c.thumbnail} alt={c.title} className="w-28 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.instructor?.name || c.instructor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.rating ?? 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.numberOfReviews ?? 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this course? This action cannot be undone.")) {
                          deleteCourse.mutate({ id: c._id });
                        }
                      }}
                      disabled={deleteCourse.isLoading}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Showing {courses.length} of {pagination.total || courses.length}</div>
          <div className="flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLimit(v);
                setPage(1);
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
            onClick={() => updateParams({ page: String(Math.max(1, page - 1)), limit: String(limit) })}
            disabled={!pagination.hasPrevPage || page <= 1}
            className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-l disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: Math.max(1, pagination.totalPages) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => updateParams({ page: String(p), limit: String(limit) })}
                aria-current={p === page}
                className={`px-3 py-1 border-t border-b border-gray-300 text-sm ${p === page ? "bg-gray-200" : "bg-white"}`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => updateParams({ page: String(Math.min(pagination.totalPages || page + 1, (pagination.totalPages || page + 1))), limit: String(limit) })}
            disabled={!pagination.hasNextPage || page >= (pagination.totalPages || 1)}
            className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminCourses;
