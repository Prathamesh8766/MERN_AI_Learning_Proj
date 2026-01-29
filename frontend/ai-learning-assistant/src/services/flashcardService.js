import axiosinstance from "../utils/axionsInstance.js";
import { API_PATHS } from "../utils/apiPath.js";
const getAllFlashcardSets = async () => {
    try {
        const response = await axiosinstance.get(API_PATHS.FLASHCARD.GET_ALL)
        console.log(response.data?.data)
        return response.data?.data
    } catch (error) {
        throw error.response.error || { message: "Fail to get the flashcards" }
    }

}

const reviewFlashcard = async (id) => {
    try {
        const response = await axiosinstance.get(API_PATHS.FLASHCARD.REVIEW_CARD(id));
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to get the flashcards" }
    }
}

const deleteFlashcardSet = async (id) => {
    try {
        console.log(id)
        const response = await axiosinstance.get(API_PATHS.FLASHCARD.DELETE_SET(id));
        console.log(response.data)
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to Delete the flashcards" }
    }

}

const getFlashcardsById = async (id) => {
    try {
        const response = await axiosinstance.get(API_PATHS.FLASHCARD.GET_BY_DOCUMENT(id));
        console.log(response.data)
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to get the flash card" }
    }

}
const toggleStarFlashcard = async (id) =>{
    try{
        const response = await axiosinstance.get(API_PATHS.FLASHCARD.TOGGLE_STAR(id));
        console.log(response.data)
        return response.data
    } catch (error) {
        throw error.response.error || { message: "Fail to card" }
    }
}

const flashcardService = {
    getAllFlashcardSets,
    getFlashcardsById,
    deleteFlashcardSet,
    reviewFlashcard
}
export default flashcardService; 