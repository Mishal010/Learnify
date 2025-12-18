import axiosInstance from "./axiosClient";

export const getAllCourseApi = async ({
  page = 1,
  limit = 12,
  category = "",
  search = "",
}) => {
  const res = await axiosInstance.get(
    `/course?page=${page}&limit=${limit}&category=${category || ""}&search=${
      search || ""
    }`
  );

  return res.data;
};

export const getCourseByIdApi = async ({ courseId }) => {
  const response = await axiosInstance.get(`/course/${courseId}`);
  return response.data;
};

export const getInstructorsCourseApi = async ({ queryKey }) => {
  const [, { page, limit }] = queryKey;
  const response = await axiosInstance.get(
    `/course/instructor?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getUploadSignatureApi = async () => {
  const response = await axiosInstance.get(`/course/signature`);
  return response.data;
};

export const createCourseApi = async ({
  title,
  description,
  thumbnail,
  category,
  price,
}) => {
  const response = await axiosInstance.post("/course/", {
    title,
    description,
    thumbnail,
    category,
    price,
  });
  return response.data;
};

export const updateCourseApi = async ({
  title,
  description,
  thumbnail,
  category,
  price,
  id,
}) => {
  const response = await axiosInstance.put(`/course/${id}`, {
    title,
    description,
    thumbnail,
    category,
    price,
  });
  return response.data;
};

export const deleteCourseApi = async ({ id }) => {
  const response = await axiosInstance.delete(`/course/${id}`);
  return response.data;
};

export const verifyEnrollmentApi = async ({ courseId }) => {
  const response = await axiosInstance.get(
    `/course/${courseId}/verify-enrollment`
  );
  return response.data;
};
