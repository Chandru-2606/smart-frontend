import apiClient from "./http"

const VerifyLogin = async(payload)=>{
    try {
        const res = await apiClient().post('/auth/login', payload)
        return res
      } catch (error) {
        throw error
      }
}

const getContacts =async()=>{
    try {
        const res = await apiClient().get('/contact')
        return res
    } catch (error) {
        return error
    }
}

const usersData =async()=>{
    try{
    const response = await apiClient().get('auth/verify-auth')
    return response
    }catch(error){
        throw error
    }
}



export {VerifyLogin, getContacts, usersData}