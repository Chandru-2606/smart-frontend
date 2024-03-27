import apiClient from "./http";

const getConfig = async () => {
  try {
    const response = await apiClient().get("/config");
    return response;
  } catch (error) {
    throw error;
  }
};

const updateConfig = async(id, data) =>{
    try {
        const response = await apiClient().put(`/config/${id}`, data)
        return response;
    } catch (error) {
        throw error
    }
}

export {getConfig , updateConfig}