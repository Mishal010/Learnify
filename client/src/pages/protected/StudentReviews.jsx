import React, { useState } from "react";
import { Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useMyReviews } from "../../hooks/queries/useMyReviews";
import { useDeleteReview } from "../../hooks/mutation/useDeleteReview";
import Loader from "../Loader";

const StudentReviews = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading } = useMyReviews({ page, limit });
  const deleteReview = useDeleteReview();

  if (isLoading) return <Loader />;

  const reviews = data?.result || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-3xl font-semibold mb-3">My Reviews</h1>
      <div className="flex flex-col gap-3">
        {reviews.length ? (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded shadow-sm p-4 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(r.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Course: {r.course?.title}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() =>
                    deleteReview.mutate({
                      reviewId: r._id,
                      courseId: r.course?._id,
                    })
                  }
                  className="text-red-600 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You have not written any reviews yet.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentReviews;
