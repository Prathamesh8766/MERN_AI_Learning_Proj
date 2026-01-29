import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";
const login = async (email, password) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AUTH.LOGIN, {
            email: email,   
            password: password
        });
        return response.data 

    } catch (error) {
        throw error.response?.data || { message: "An unknow error" }
    }
}

const register = async (email, password, username) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AUTH.REGISTER, {
            email: email,
            password: password,
            username: username
        });

        return response.data
    } catch (error) {
        throw error.response?.data || { message: "An unknow error" }
    }
}

const getProfile = async () => {
    try {
        const response = await axiosinstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "An unknow error" }
    }
}

const changePassword = async (password) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
            password: password
        });
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "An unknow error" }
    }
}

const updateProfile = async (userData) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AUTH.UPDATE_PROFILE, {
            userData: userData
        });
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "An unknow error" }
    }

}
const authServer = {
    login,
    updateProfile,
    getProfile,
    changePassword,
    register

}
export default authServer;
