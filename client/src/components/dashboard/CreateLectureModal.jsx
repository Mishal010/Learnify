import { Trash2, UploadCloud, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getUploadSignatureApi } from "../../api/courseApi";
import toast from "react-hot-toast";
import { imagekit } from "../../utils/imageKit";
import { useCreateLecture } from "../../hooks/mutation/useCreateLecture";
import { useCourseStore } from "../../store/useCourseStore";
import { useCourseLectures } from "../../hooks/queries/useCourseLectures";
import { useDeleteLecture } from "../../hooks/mutation/useDeleteLecture";

const CreateLectureModal = ({ open, onClose }) => {
  {
    /* useStates for video file handling */
  }
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileId, setFileId] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const selectedCourseId = useCourseStore((state) => state.selectedCourseId);

  const { data, isLoading } = useCourseLectures(selectedCourseId);

  const setPreviewUrlFn = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  {
    /* useEffect for setting body overflow hidden based on the modal open/clos */
  }
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [open]);

  {
    /* uploading video to imagekit */
  }

  const uploadToImageKit = async () => {
    if (!videoFile) return toast.error("Select a file first.");
    if (!selectedCourseId) return toast.error("Select a course first to upload a lecture");

    setUploading(true);

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
            console.error("Upload error", err);
            toast.error("Upload Failed");
            return;
          }

          const transformed = `${result.url}/ik-master.m3u8?tr=sr-240_360_480_720_1080`;

          setUrl(transformed);
          setFileId(result.fileId);
          toast.success("Video uploaded ✅");
        }
    );
  };

  const mutation = useCreateLecture();

  const deleteMutation = useDeleteLecture();

  const handleDelete = (id) => {
    if (!id) return toast.error("Please provide the lecture id to delete");
    deleteMutation.mutate({ lectureId: id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Lecture title is required");
    if (!fileId || !url) return toast.error("Upload a video first");
    if (!selectedCourseId) return toast.error("No course selected");
    mutation.mutate({
      title: title.trim(),
      order: Number(order),
      fileId,
      url,
      courseId: selectedCourseId,
    });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setTitle("");
      setOrder(0);
      setVideoFile(null);
      setPreviewUrl("");
      setFileId("");
      setUrl("");
      // Keep courseId in store, don't clear it
    }
  }, [mutation.isSuccess]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        className="
          bg-white 
          w-full 
          max-w-4xl 
          rounded-xl
          max-lg:p-3
          p-6 
          shadow-xl 
          flex 
          md:flex-row 
          flex-col
          relative
          max-h-[90vh]
        "
      >
        {/* LEFT / TOP SECTION */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            md:border-b-0
            md:border-r 
            border-gray-300 
            xl:pr-4 
            mb-6 
            xl:mb-0 
            p-2
            xl:max-h-[85vh]
            max-h-[90vh]
          "
        >
          <h1 className="text-2xl font-semibold mb-4 w-full flex items-center justify-between">
            Upload Lecture{" "}
            <span
              className="text-sm flex bg-red-500 max-lg:p-1 max-lg:rounded-full py-2 px-3 text-white rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-white font-medium lg:hidden" />
              <span className="max-lg:hidden">Close</span>
            </span>
          </h1>

          <div className="w-full rounded-md bg-gray-200 h-58 mb-4 flex flex-col justify-center items-center hover:cursor-pointer relative">
            {previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover rounded-md absolute inset-0 z-100"
              />
            ) : (
              <>
                <UploadCloud size={50} />
                <p className="text-sm text-center">
                  Choose a video file to upload (Max size limit: 100 MB)
                </p>
              </>
            )}

            <input
              type="file"
              name="file"
              id="file"
              onChange={setPreviewUrlFn}
              className="absolute inset-0 opacity-0  hover:cursor-pointer"
            />
            <button
              className="bg-blue-500 text-white text-sm font-medium py-1 px-2 rounded-md w-fit absolute top-1 right-1 z-200 hover:cursor-pointer"
              onClick={uploadToImageKit}
              disabled={!videoFile || uploading || !selectedCourseId}
            >
              {uploading ? "Uploading..." : !selectedCourseId ? "Select Course" : "Upload Video"}
            </button>
          </div>

          <form className="flex flex-col gap-4 pb-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="font-medium">
                Lecture Title
              </label>
              <input
                value={title}
                type="text"
                id="title"
                placeholder="Enter Lecture Title"
                className="border-b border-gray-400 w-full py-2 outline-none"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="order" className="font-medium">
                Lecture Number
              </label>
              <input
                value={order}
                className="border-b border-gray-400 w-24 py-2 outline-none"
                type="number"
                id="order"
                min="0"
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="url" className="font-medium">
                Lecture URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                readOnly
                placeholder="Lecture URL"
                className="border-b border-gray-400 w-full py-2 outline-none"
              />
            </div>

            <div>
              <label htmlFor="fileId" className="font-medium">
                Lecture File Id
              </label>
              <input
                type="text"
                id="fileId"
                value={fileId}
                readOnly
                placeholder="Lecture File Id"
                className="border-b border-gray-400 w-full py-2 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="bg-blue-400 text-white text-md font-semibold w-[150px] py-2 rounded-full hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* RIGHT / BOTTOM SECTION */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            xl:pl-4 
            
            md:max-h-[85vh]
            max-h-[10vh]
          "
        >
          <div>
            {isLoading ? (
              <p className="p-4 text-gray-500">Loading lectures...</p>
            ) : data?.lectures && data.lectures.length > 0 ? (
              data.lectures.map((lec) => (
                <div
                  key={lec._id}
                  className="px-5 py-4 border-b border-gray-400 flex gap-3"
                >
                  {/* {lec.order} {lec.title} */}
                  <span>{lec.order}</span>
                  <div className="flex justify-between flex-1">
                    <p>{lec.title}</p>
                    <button
                      className="bg-red-500  p-1 rounded-lg text-amber-50"
                      onClick={() => handleDelete(lec._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No lectures yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLectureModal;
