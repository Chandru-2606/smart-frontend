import apiClient from "./http";

const createDevice = async (payload) => {
  try {
    const response = await apiClient().post("/device", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

const getDevices = async () => {
    try {
      const response = await apiClient().get(`/device`);
      return response;
    } catch (error) {
      throw error;
    }
  };


  const updateDevice = async (id, data) => {
    try {
      const response = await apiClient().put(`/device/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteDevice = async (id) => {
    try {
      const response = await apiClient().delete(`/device/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };


export {createDevice,getDevices, updateDevice, deleteDevice}