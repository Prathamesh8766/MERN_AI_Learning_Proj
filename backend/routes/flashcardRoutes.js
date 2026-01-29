import express from "express"
import {getFlashcards,
        getAllFlashcardSets,
        reviewFlashcard,
        toggleStarFlashcard,
        deleteFlashcardSet,
        
} from "../controllers/flashcardController.js"
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect)
router.get("/:documentId",getFlashcards);
router.get('/',getAllFlashcardSets);
router.delete('/:id',deleteFlashcardSet);
router.post('/:cardId/review',reviewFlashcard);
router.put("/:cardId/start", toggleStarFlashcard);

export default router;