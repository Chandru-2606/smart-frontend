import apiClient from "./http";

const getRecharge = async()=>{
    try{
    const response = await apiClient().get('/recharge')
    return response
    }catch(error){
        throw error
    }
 }
const createRecharge = async(payload)=>{
    try{
        const response = await apiClient().get('/recharge', payload)
        return response
    }catch(error){
        throw error
    }
}
 const updateRecharge = async(id, payload)=>{
    try{
        const response = await apiClient().put(`/recharge/${id}`, payload)
        return response
    }catch(error){
        throw error
    }
 }

 export {getRecharge, updateRecharge, createRecharge}