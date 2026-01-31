import axiosInstance from "./axiosClient";

export const getAllUserApi = async ({ page = 1, limit = 12, role = "" }) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (role) params.set("role", role);

  const response = await axiosInstance.get(`/user/all?${params.toString()}`);
  return response.data;
};

// export const getUserByIdApi = async (id) => {
//   const response = await axiosInstance.get(`/user/${id}`);
//   return response.data;
// };

export const profileApi = async () => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};

export const updateProfileApi = async ({ name, email }) => {
  const response = await axiosInstance.put("/user/profile", { name, email });
  return response.data;
};

export const deleteUserApi = async ({ id }) => {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
};

export const enrolledCourseApi = async () => {
  const response = await axiosInstance.get("/user/my-enrollments");
  return response.data;
};
