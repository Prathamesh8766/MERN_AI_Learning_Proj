import express from "express";
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
} from "../controllers/aiController.js";
import protect from '../middleware/auth.js'

const router = express.Router() // What is router

router.use(protect); // What is use
 
router.post('/generate-flashcards', generateFlashcards);  // what are different methods like route
router.post('/generate-quize', generateQuiz);
router.post('/generate-summary', generateSummary);
router.post('/explain-concept', explainConcept);
router.post('/chat', chat);
router.post('/generate-history', getChatHistory);

export default router;

