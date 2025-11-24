import apiClient from "./http";

const getStudents = async()=>{
    try{
    const response = await apiClient().get('/student')
    return response
    }catch(error){
        throw error
    }
}

const getStudentByID = async(id)=>{
    try{
    const response = await apiClient().get(`/student/${id}`)
    return response
    }catch(error){
        throw error
    }
}

const updateStudent = async(id, payload)=>{
    try{
    const response = await apiClient().put(`/student/${id}`, payload)
    return response
    }catch(error){
        throw error
    }
}

const createStudent = async(payload)=>{
    try{
    const response = await apiClient().post(`/student`, payload)
    return response
    }catch(error){
        throw error
    }
}

const deleteStudent = async(id)=>{
    try{
    const response = await apiClient().delete(`/student/${id}`)
    return response
    }catch(error){
        throw error
    }
}

const getContactByStudent =async(id)=>{
    try{
        const response = await apiClient().get(`/student/get-contacts/${id}`)
        return response
    }catch(error){
        throw error
    }
}

const updateCardValidity = async (id, isValid) => {
    try {
        const response = await apiClient().put(`/student/update-validity/${id}`, { isValid });
        return response;
    } catch (error) {
        throw error;
    }
};

const validateCall = async (studentId) => {
    try {
        const response = await apiClient().post(`/student/validate-call`, { studentId });
        return response;
    } catch (error) {
        throw error;
    }
}

const bulkCreateStudents = async (students) => {
    try {
        const response = await apiClient().post(`/student/bulk`, { students });
        return response;
    } catch (error) {
        throw error;
    }
}

export {getStudents, getStudentByID, updateStudent, createStudent, deleteStudent, getContactByStudent, updateCardValidity, validateCall, bulkCreateStudents}