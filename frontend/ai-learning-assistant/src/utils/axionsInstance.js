import axios from "axios";
import { BASE_URL } from "./apiPath.js";

//axios instance                      //0) dose it is midddleware for frontend
const axiosinstance = axios.create({       //1)expain axios instance in detail.(Note i also asken this question(5) below so tell me ass per you choise whre to explain it is sutable)
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {                                // 2)What this content in the create? what else content another of this is exist
        "Content-Type": "application/json",  // 3)what is content type , what are onoter type, and wahy this application/json is taken
        Accept: 'application/json'               //4)expain accept waht ater parameter than tis exist
    },
});
// Axioinstance for request
axiosinstance.interceptors.request.use((config) => {   //5) expain axiosinstance in detail, config expalin, waht content this conficg carry 
    const accesstoken = localStorage.getItem("token");//6) dose this "token" exist or when we made it in backene in jwt only then ext and use here 
    if (accesstoken) {  
        config.headers.Authorization = `Bearer ${accesstoken}`;
        console.log(config.headers.Authorization) //7) why this token checking here i all ready done it in the backend to wher
        //  i check the token exist of not if exist then fureter lifecyle continu
        //( it is in middle ware called auth.js whit name protect. router.post("htt..",protect,controllere))
    }
    return config            // 8)waht content this conficg carry now ater returinging 
}, (error) => {          //9) waht type of error dose it can carry.
    return error
}); // except this waht else can it will can be ysed for 

//Axiosinstance for response

axiosinstance.interceptors.response.use(
    (response) => {
        return response  // 10)suppose the request gose to backend api then it carry error with as response and wee see the error (like 500, 400,401,404) any 
    }, (error) => {
        if (error.response) {          // why the need of error here 
            if (error.response.status === 500) {
                console.log("Server error try later");
            } else if (error.code === "ECONNABORTED") {
                console.log("Request time out please try again")
            }
        }
        return Promise.reject(error)
    });

export default axiosinstance;