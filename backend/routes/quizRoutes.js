import express from "express";
import{
    getQuizs,
    getQuizById,
    submitQuiz,
    getQuizeResult,
    deleteQuize
} from "../controllers/quizController.js"
import protect from "../middleware/auth.js";

const router = express.Router()

router.use(protect)

router.get("/:documentId", getQuizs);
router.get("/quiz/:id", getQuizById);
router.post("/:id/submit", submitQuiz);
router.get("/:id/result", getQuizeResult);
router.delete("/:id", deleteQuize);

export default router;

