import axiosInstance from "./axiosClient";

export const myReviewsApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(
    `/review/my-reviews?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const allReviewsApi = async ({ page = 1, limit = 10, courseId }) => {
  const response = await axiosInstance.get(
    `/review/course/${courseId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const createReviewApi = async ({ courseId, comment, rating }) => {
  const response = await axiosInstance.post(
    `/review/create/course/${courseId}`,
    { comment, rating }
  );
  return response.data;
};

export const updateReviewApi = async ({
  reviewId,
  courseId,
  comment,
  rating,
}) => {
  const response = await axiosInstance.patch(
    `/review/${reviewId}/course/${courseId}`,
    { comment, rating }
  );
  return response.data;
};

export const deleteReviewApi = async ({ reviewId, courseId }) => {
  const response = await axiosInstance.delete(
    `/review/${reviewId}/course/${courseId}`
  );
  return response.data;
};
