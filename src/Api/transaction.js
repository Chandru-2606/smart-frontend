import apiClient from "./http";


const getTransaction = async()=>{
    try{
    const response = await apiClient().get('/transaction')
    return response
    }catch(error){
        throw error
    }
}

const createTransactions = async(payload)=>{
    try {
        const response = await apiClient().post('/transaction', payload)
        return response;
    } catch (error) {
        throw error
    }
}

export {getTransaction, createTransactions}