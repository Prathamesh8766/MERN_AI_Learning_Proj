import Quize from "../models/Quiz.js";

/* ================= GET ALL QUIZZES ================= */
export const getQuizs = async (req, res, next) => {
    try {
        const quizes = await Quize.find({
            documentId: req.params.documentId,
            userId: req.user._id
        })
        .populate("documentId", "title fileName")
        .sort({ createdAt: -1 });
       
        res.status(200).json({
            success: true,
            message: "Successfully fetched quizzes",
            data: quizes
        });
    } catch (error) {
        next(error);
    }
};

/* ================= GET QUIZ BY ID ================= */
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quize.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
    console.log("this is get by it")
        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz does not exist"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

/* ================= SUBMIT QUIZ ================= */
export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: "Provide answers"
            });
        }

        const quiz = await Quize.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz does not exist"
            });
        }

        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz already completed"
            });
        }

        let correctCount = 0;
        const userAnswers = [];

        answers.forEach(({ questionIndex, selectedAnswer }) => {
            const question = quiz.questions[questionIndex];
            if (!question) return;

            const isCorrect = selectedAnswer === question.correctAnswer;
            if (isCorrect) correctCount++;

            userAnswers.push({
                questionIndex,
                selectedAnswer,
                isCorrect,
                answeredAt: new Date()
            });
        });

        quiz.score = Math.round((correctCount / quiz.totalQuestions) * 100);
        quiz.userAnswers = userAnswers;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            message: "Quiz completed",
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

/* ================= DELETE QUIZ ================= */
export const deleteQuize = async (req, res, next) => {
    try {
        const quiz = await Quize.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz does not exist"
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: "Quiz deleted"
        });
    } catch (error) {
        next(error);
    }
};

/* ================= QUIZ RESULT ================= */
export const getQuizeResult = async (req, res, next) => {
    try {
        const quiz = await Quize.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz does not exist"
            });
        }

        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz not completed"
            });
        }

        const detailedResults = quiz.questions.map((q, index) => {
            const ua = quiz.userAnswers.find(a => a.questionIndex === index);
            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                selectedAnswer: ua?.selectedAnswer || null,
                isCorrect: ua?.isCorrect || false,
                explanation: q.explanation
            };
        });

        res.status(200).json({
            success: true,
            data: {
                quiz,
                results: detailedResults
            }
        });
    } catch (error) {
        next(error);
    }
};
