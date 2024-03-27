import apiClient from "./http";

const createContact = async (payload) => {
  try {
    const response = await apiClient().post("/getContacts", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

const getContacts = async (id) => {
    try {
      const response = await apiClient().get(`/getContacts`);
      return response;
    } catch (error) {
      throw error;
    }
  };

const getContactById = async (id) => {
    try {
      const response = await apiClient().get(`/get-contacts/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateContact = async (id, payload) => {
    try {
      const response = await apiClient().put(`/getContacts/${id}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteContact = async (id)=>{
    try {
        const response = await apiClient().delete(`/getContacts/${id}`)
        return response;
    } catch (error) {
        throw error
    }
  }

export { createContact, getContactById, getContacts, updateContact, deleteContact };
