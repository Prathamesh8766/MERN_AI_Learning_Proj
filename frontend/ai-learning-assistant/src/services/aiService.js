import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

const generateFlashcards = async (documentId, options) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
            documentId, ...options
        });
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: "Faild to generate Flashcards" }
    }
}

const generateQuiz = async (documentId, options) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AI.GENERATE_QUIZ, {
            documentId, ...options
        })
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "Faild to generate Quiz" }
    }
}

const generateSummary = async (documentId) => {
    try {
        console.log(documentId)
        const response = await axiosinstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
            documentId
        });
        console.log(response.data?.data)
        return response.data?.data
    } catch (error) {
        throw error.response?.data || { message: "Faild to generate Summary" }
    }
}

const chat = async (documentId, message) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AI.CHAT, {
            documentId, question: message
        });
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "Chat request failed" }
    }
}

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosinstance.post(API_PATHS.AI.EXPLAIN_CONCEPT,{documentId, concept});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Expain request faild"}
    }
}

const getchatHistory = async (documentId) =>{
     try {
        const response = await axiosinstance.post(API_PATHS.AI.CHAT_HISTORY,{documentId});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Get chat history request faild"}
    }
}

const aiService={
    getchatHistory,
    generateQuiz,
    generateSummary,
    explainConcept,
    chat,
    generateFlashcards
}

export default aiService;