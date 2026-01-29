import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 📊 Counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSet = await Flashcard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null }
    });

    // 📚 Flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });

    let totalFlashcards = 0;
    let reviewFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach(set => {
      totalFlashcards += set.cards.length;
      reviewFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter(c => c.isStarted).length;
    });

    // 📝 Quiz statistics
    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null }
    });

    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
          )
        : 0;

    // 🕒 Recent documents
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select("title fileName lastAccessed status");

    // 🧪 Recent quizzes
    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions completedAt");

    // 🔥 Study streak (mock)
    const studyStreak = Math.floor(Math.random() * 7) + 1;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSet,
          totalFlashcards,
          reviewFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          studyStreak
        },
        recentDocuments,
        recentQuizzes
      }
    });
  } catch (error) {
    next(error);
  }
};
