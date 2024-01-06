import apiClient from "./http";

const createContact = async (payload) => {
  try {
    const response = await apiClient().post("/contact", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

const getContacts = async (id) => {
    try {
      const response = await apiClient().get(`/contact`);
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
      const response = await apiClient().put(`/contact/${id}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteContact = async (id)=>{
    try {
        const response = await apiClient().delete(`/contact/${id}`)
        return response
    } catch (error) {
        throw error
    }
  }

export { createContact, getContactById, getContacts, updateContact, deleteContact };
