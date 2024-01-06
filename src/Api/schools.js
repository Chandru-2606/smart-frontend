import apiClient from "./http";

const createSchool = async(data)=>{
    try {
        const response = await apiClient().post('/school', data)
        return response
    } catch (error) {
        throw error
    }
}
const getSchools =async()=>{
    try {
        const response = await apiClient().get('/school')
        return response
    }catch(error){
        throw error
    }
}

const updateSchool = async(id, payload)=>{
    try {
        const response = await apiClient().put(`/school/${id}`, payload)
        return response
    } catch (error) {
        throw error
    }
}
const deleteSchool = async(id)=>{
    try {
        const response = await apiClient().delete(`/school/${id}`)
        return response
    } catch (error) {
        throw error
    }
}

const getStudentBySchool = async(id)=>{
    try{
        const response = await apiClient().get(`/school/get-students/${id}`)
        return response
    }catch(error){
        throw error
    }
}
export {getSchools, updateSchool, deleteSchool, createSchool, getStudentBySchool}