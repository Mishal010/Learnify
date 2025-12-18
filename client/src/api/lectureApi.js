import axiosInstance from "./axiosClient";

export const getCourseLectureApi = async ({ courseId }) => {
  const response = await axiosInstance.get(`/lecture/course/${courseId}`);
  return response.data;
};

export const getLectureApi = async ({ id }) => {
  const response = await axiosInstance.get(`/lecture/${id}`);
  return response.data;
};

export const createLectureApi = async ({
  title,
  order,
  fileId,
  url,
  courseId,
}) => {
  const response = await axiosInstance.post(
    `/lecture/${courseId}/upload-lecture`,
    { title, order, fileId, url }
  );
  return response.data;
};

export const updateLectureApi = async ({ title, order, fileId, url, id }) => {
  const response = await axiosInstance.patch(`/lecture/${id}`, {
    title,
    order,
    fileId,
    url,
  });
  return response.data;
};

export const deleteLectureApi = async ({ lectureId }) => {
  const response = await axiosInstance.delete(`/lecture/${lectureId}`);
  return response.data;
};
