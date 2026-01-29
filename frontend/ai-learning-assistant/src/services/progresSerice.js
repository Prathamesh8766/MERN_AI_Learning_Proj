import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

const getDashboardData = async ()=>{
    try{
        const token = localStorage.getItem("token");
        console.log("Received Token:", token);
        console.log("Received Token (JSON):", JSON.stringify(token, null, 2));
        const response = await axiosinstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD);
        return response.data;
    }catch(error){
        throw error.response.data || {message :"conot get the Dashboard "}
    }
}
const progressService={
    getDashboardData
}
export default progressService;