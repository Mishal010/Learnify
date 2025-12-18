import React, { useEffect, useState } from "react";
import { getUploadSignatureApi } from "../../api/courseApi";
import { imagekit } from "../../utils/imageKit";
import { useUpdateLecture } from "../../hooks/mutation/useUpdateLecture";
import toast from "react-hot-toast";

const UpdateLectureModal = ({ open, onClose, lecture, courseId }) => {
  const [title, setTitle] = useState(lecture?.title || "");
  const [order, setOrder] = useState(lecture?.order || 0);
  const [url, setUrl] = useState(lecture?.url || "");
  const [fileId, setFileId] = useState(lecture?.fileId || "");
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(lecture?.url || "");
  const [uploading, setUploading] = useState(false);

  const updateMutation = useUpdateLecture();

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title || "");
      setOrder(lecture.order || 0);
      setUrl(lecture.url || "");
      setFileId(lecture.fileId || "");
      setPreviewUrl(lecture.url || "");
    }
  }, [lecture]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const setPreview = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setVideoFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const uploadToImageKit = async () => {
    if (!videoFile) return toast.error("Select a file first.");
    setUploading(true);
    try {
      const { authParam } = await getUploadSignatureApi();
      imagekit.upload(
        {
          file: videoFile,
          fileName: videoFile.name,
          signature: authParam.signature,
          token: authParam.token,
          expire: authParam.expire,
          tags: ["lecture-video"],
          folder: "/lectures",
          useUniqueFileName: true,
        },
        (err, result) => {
          setUploading(false);
          if (err) {
            console.error(err);
            toast.error("Upload Failed");
            return;
          }
          const transformed = `${result.url}/ik-master.m3u8?tr=sr-240_360_480_720_1080`;
          setUrl(transformed);
          setFileId(result.fileId);
          toast.success("Video uploaded ✅");
        }
      );
    } catch (err) {
      setUploading(false);
      console.error(err);
      toast.error("Upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");
    if (!url || !fileId) return toast.error("Upload/choose video first");
    try {
      await updateMutation.mutateAsync({
        id: lecture._id,
        title: title.trim(),
        order: Number(order),
        url,
        fileId,
        courseId,
      });
      onClose();
    } catch (err) {
      // handled by hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Edit Lecture</h3>
        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Order</label>
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-medium">Video File</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="file" accept="video/*" onChange={setPreview} />
              <button
                type="button"
                onClick={uploadToImageKit}
                disabled={uploading || !videoFile}
                className="px-3 py-2 bg-blue-500 text-white rounded-md disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isLoading || uploading}
              className="px-6 py-2 bg-amber-400 text-white rounded-md disabled:opacity-60"
            >
              {updateMutation.isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLectureModal;
