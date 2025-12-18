import React, { useEffect, useState } from "react";
import { getUploadSignatureApi } from "../../api/courseApi";
import { imagekit } from "../../utils/imageKit";
import { useUpdateCourse } from "../../hooks/mutation/useUpdateCourse";

const UpdateCourseModal = ({ open, onClose, course }) => {
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

  const updateCourse = useUpdateCourse();

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        category: course.category || "",
        thumbnail: course.thumbnail || "",
      });
    }
  }, [course]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMsg("Uploading image...");

    try {
      const { authParam } = await getUploadSignatureApi();

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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setMsg("");
      await updateCourse.mutateAsync({ ...form, id: course._id });
      setMsg("Updated");
      setTimeout(() => onClose(), 700);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Update Course</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md h-24 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

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

        {msg && (
          <p className="mt-3 text-center font-medium text-blue-600">{msg}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading || uploading}
            className="px-6 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourseModal;
