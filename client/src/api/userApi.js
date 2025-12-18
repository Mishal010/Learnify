import axiosInstance from "./axiosClient";

export const getAllUserApi = async ({ page, limit, role }) => {
  const response = await axiosInstance.get(
    `/user/all?page=${page}&limit=${limit}&role=${role}`
  );
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
  const response = await axiosInstance.get("/user/enrollment");
  return response.data;
};
