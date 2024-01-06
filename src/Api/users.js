import apiClient from "./http";

const getUsers = async () => {
  try {
    const response = await apiClient().get("/user");
    return response;
  } catch (error) {
    throw error;
  }
};

const createUsers = async (payload) => {
    try {
      const response = await apiClient().post("/auth/register", payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUsers = async (id,payload) => {
    try {
      const response = await apiClient().put(`/user/${id}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteUsers = async (id) => {
    try {
      const response = await apiClient().delete(`/user/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

export { getUsers, updateUsers, deleteUsers, createUsers };
