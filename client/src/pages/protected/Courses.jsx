import React, { useState } from "react";
import { useInstructorsCourse } from "../../hooks/queries/useInstructorsCourse";
import Loader from "../Loader";
import { useDeleteCourse } from "../../hooks/mutation/useDeleteCourse";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";

const Courses = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useInstructorsCourse({
    page,
    limit,
  });

  const deleteCourse = useDeleteCourse();

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="p-6">
        <p className="text-red-600">{error?.message || "Failed to load"}</p>
      </div>
    );

  const courses = data?.result || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this course? This action cannot be undone."))
      return;
    deleteCourse.mutate({ id });
  };

  return (
    <div className="w-full bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Courses</h2>
        <div className="text-sm text-slate-600">Total: {pagination.total}</div>
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                Course
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 hidden lg:table-cell">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 hidden lg:table-cell">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-slate-100">
            {courses.map((c, idx) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 align-middle text-sm text-slate-700">
                  {(page - 1) * limit + idx + 1}
                </td>

                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-12 h-8 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-slate-900">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {c.instructor?.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 align-middle hidden md:table-cell text-sm text-slate-700">
                  {c.category}
                </td>

                <td className="px-4 py-3 align-middle hidden lg:table-cell text-sm text-indigo-600">
                  ₹{c.price}
                </td>

                <td className="px-4 py-3 align-middle hidden lg:table-cell text-sm text-slate-700">
                  {c.rating || 0} ({c.numberOfReviews || 0})
                </td>

                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    {/* Full buttons on md+ */}
                    <div className="hidden md:flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/course/${c._id}`)}
                        className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Icons on small screens */}
                    <div className="flex md:hidden items-center gap-2">
                      <button
                        onClick={() => navigate(`/course/${c._id}`)}
                        className="p-2 bg-indigo-500 text-white rounded-md"
                        aria-label="View course"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-2 bg-red-100 text-red-700 rounded-md"
                        aria-label="Delete course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
          disabled={page === pagination.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Courses;
