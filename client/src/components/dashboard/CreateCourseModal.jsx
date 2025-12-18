import React, { useState } from "react";
import { getUploadSignatureApi } from "../../api/courseApi";
import { imagekit } from "../../utils/imageKit";
import { useCreateCourse } from "../../hooks/mutation/useCreateCourse";

const CreateCourseModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    thumbnail: "",
  });

  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const createCourse = useCreateCourse();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------
  // IMAGE UPLOAD HANDLER (uses backend signature + shared imagekit util)
  // --------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMsg("Uploading image...");

    try {
      const { authParam } = await getUploadSignatureApi();

      // Upload using shared imagekit instance
      imagekit.upload(
        {
          file,
          fileName: `course_${Date.now()}`,
          signature: authParam.signature,
          token: authParam.token,
          expire: authParam.expire,
          folder: "/courses",
          useUniqueFileName: true,
        },
        (err, result) => {
          setUploading(false);
          if (err) {
            console.error(err);
            setMsg("Image upload failed");
            return;
          }
          setForm((prev) => ({ ...prev, thumbnail: result.url }));
          setMsg("Thumbnail uploaded ✔");
        }
      );
    } catch (err) {
      console.error(err);
      setMsg("Image upload failed");
      setUploading(false);
    }
  };

  // --------------------------
  // CREATE COURSE
  // --------------------------
  const handleCreate = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await createCourse.mutateAsync({ ...form });

      setMsg(res?.message || "Course created");
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Create Course</h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
              placeholder="Course title"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-semibold">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
              placeholder="Category"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md h-24 resize-none"
              placeholder="Describe your course"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
              placeholder="299"
            />
          </div>

          {/* Thumbnail upload */}
          <div className="flex flex-col">
            <label className="font-semibold">Thumbnail</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />

            {uploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}

            {form.thumbnail && (
              <img
                src={form.thumbnail}
                className="mt-2 w-full h-28 object-cover rounded-md border"
              />
            )}
          </div>
        </div>

        {/* Status */}
        {msg && (
          <p className="mt-3 text-center font-medium text-blue-600">{msg}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading || uploading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
