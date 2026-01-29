import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

const getDocuments = async ()=>{
    try{
        const response = await axiosinstance.get(API_PATHS.DOCUMENT.GET_ALL,)
        console.log(response.data)
        return response.data?.data;
        
    }catch(error){
        throw error.response?.data || {message: "Failt to get Document"};
    }
}

const uploadDocument = async (formData)=>{
    try{
        const response = await axiosinstance.post(API_PATHS.DOCUMENT.UPLOAD,formData,{
          headers:{  
            "Content-Type": 'multipart/form-data',
        }
        });
        return response.data;
    }catch(error){
        throw error.response?.data || {message:'Fail to upload file'}
    }
}

const getDocumentByID = async (documentId)=>{
    try{
        const response = await axiosinstance.get(API_PATHS.DOCUMENT.GET_BY_ID(documentId))
        console.log(response.data)
        return response.data;

    }catch(error){
        throw error.response?.data || {message: "Failt to get Document"};
    }
}

const deleteDocument = async (documentId)=>{
    try{
        console.log(documentId)
        const response = await axiosinstance.delete(API_PATHS.DOCUMENT.DELETE(documentId))
    return response.data;

    }catch(error){
        throw error.response?.data || {message: "Failt to delete Document"};
    }
}

const  documentService={
    getDocuments,
    getDocumentByID,
    deleteDocument,
    uploadDocument

}

export default documentService;