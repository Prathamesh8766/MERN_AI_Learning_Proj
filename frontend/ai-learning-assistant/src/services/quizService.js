import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

const getQuizs = async (quizId) => {
    try {
        const response = await axiosinstance.get(API_PATHS.QUIZ.GET_BY_DOCUMENT(quizId))
        return response.data;
    } catch (error) {
        throw error.response.error || { message: "Fail to get the flashcards" }
    }

}

const getQuizsResult = async (quizId) => {
    try {
        const response = await axiosinstance.get(API_PATHS.QUIZ.GET_BY_ID(quizId))
        return response.data;
    } catch (error) {
        throw error.response.error || { message: "Fail to get result" }
    }

}

const  submitQuiz = async (quizeId,answer) => {
    try {
        const response = await axiosinstance.get(API_PATHS.QUIZ.SUBMIT(quizeId),{
            answer
        });
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to Submit" }
    }
}

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosinstance.get(API_PATHS.QUIZ.DELETE(quizId));
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to Delete Quiz" }
    }

}

const getQuizById = async (quizId) => {
    try {
        const response = await axiosinstance.get(API_PATHS.QUIZ.GET_BY_ID(quizId));
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to get Quiz" }
    }

}

const quizService = {
    getQuizById,
    getQuizs,
    deleteQuiz,
    submitQuiz,
    getQuizsResult
}
export default quizService; 