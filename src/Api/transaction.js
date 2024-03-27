import apiClient from "./http";


const getTransaction = async()=>{
    try{
    const response = await apiClient().get('/endCall')
    return response
    }catch(error){
        throw error;
    }
}

const createTransactions = async(payload)=>{
    try {
        const response = await apiClient().post('/endCall', payload)
        return response;
    } catch (error) {
        throw error
    }
}

const getStats = async(id)=>{
    try {
        const response = await apiClient().get(`/endCall/school/${id}/stats`)
        return response;
    } catch (error) {
         throw error;   
    }
}

const getAllStats = async()=>{
    try {
        const response = await apiClient().get(`/endCall/overall/stats`)
        return response;
    } catch (error) {
         throw error;   
    }
}

export {getTransaction, createTransactions , getStats, getAllStats}