import React, { useState } from "react";
import { useCreateReview } from "../hooks/mutation/useCreateReview";
import { Star } from "lucide-react";

const AddReview = ({ courseId, onCreated }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const submit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createReview.mutate(
      { courseId, comment: comment.trim(), rating },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
          if (onCreated) onCreated();
        },
      }
    );
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`p-1 rounded ${
                i <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-label={`Rate ${i}`}
            >
              <Star className="w-5 h-5" />
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">{rating} / 5</div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your honest feedback about this course"
        className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={createReview.isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {createReview.isLoading ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={() => {
            setComment("");
            setRating(5);
          }}
          className="text-sm text-gray-600"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddReview;
