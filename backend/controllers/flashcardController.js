import Flashcard from "../models/Flashcard.js";

/**
 * Get flashcards for a specific document
 * GET /api/flashcards/:documentId
 */
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all flashcard sets of the logged-in user
 * GET /api/flashcards
 */
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      userId: req.user._id,
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Review a flashcard
 * PUT /api/flashcards/review/:cardId
 */
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
        statusCode: 404,
      });
    }

    card.lastReviewed = new Date();
    card.reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: "Flashcard reviewed successfully",
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Star / unstar a flashcard
 * PUT /api/flashcards/star/:cardId
 */
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
        statusCode: 404,
      });
    }

    card.isStarred = !card.isStarred;
    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: `Flashcard ${card.isStarred ? "starred" : "unstarred"}`,
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an entire flashcard set
 * DELETE /api/flashcards/:id
 */
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
        statusCode: 404,
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
