import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiServer.js';
import { findRelevantChunks } from "../utils/textChunker.js";
import { json } from "express";

export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 5 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "documentId is required",
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
            });
        }

        // 🔹 Gemini called ONCE
        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map((card) => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false,
            })),
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: "Flashcards generated successfully",
        });
    } catch (error) {
        next(error);
    }
};
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;

        // 1️⃣ Validate input
        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: "Provide documentId and question",
                statusCode: 400,
            });
        }

        // 2️⃣ Fetch document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statusCode: 404,
            });
        }

        // 3️⃣ Find relevant chunks
        const relevantChunks = await findRelevantChunks(
            document.chunks,
            question,
            1
        );

        const chunkIndices = relevantChunks.map(c => c.chunkIndex);

        // 4️⃣ Load or create chat history
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id,
        });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: [],
            });
        }

        // 5️⃣ Ask Gemini
        const answer = await geminiService.chatWithContext(
            question,
            relevantChunks
        );

        // 6️⃣ Save messages
        chatHistory.messages.push(
            {
                role: "user",
                content: question,
                timestamp: new Date(),
                relevantChunks: chunkIndices,
            },
            {
                role: "assistant",
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices,
            }
        );

        await chatHistory.save();

        // 7️⃣ Response
        res.status(200).json({
            success: true,
            message: "Response successful",
            data: {
                question,
                answer,
                relevantChunks: chunkIndices,
                chatHistoryId: chatHistory._id,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getChatHistory = async (req, res, next) => {
    try {
        
        const { documentId } = req.body;
        console.log(documentId)
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Provide documentId ",
                statusCode: 400,
            });
        }
        

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statusCode: 404,
            });
        }
        
        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        }).select("messages")

        if (!chatHistory) {
            return res.status(404).json({
                success: false,
                error: "Chat History not found or not ready",
                statusCode: 404,
            });
        }
        console.log(chatHistory.messages)
        res.status(200).json({
            success: true,
            message: "Chat history found",
            data: {
                messages:chatHistory.messages
            },
            statusCode: 200
        })


    } catch (error) {
        next(error)
    }

}
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        // 1️⃣ Validate input
        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: "Provide documentId and concept",
                statusCode: 400,
            });
        }

        // 2️⃣ Fetch document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statusCode: 404,
            });
        }

        const relevantChunks = findRelevantChunks(document.chunks, concept, 1);
        const context = relevantChunks.map(c => c.content).join('\n\n');

        //Generate explanation from gemini
        const explanation = await geminiService.explainConcept(concept, context);
        if (!explanation) {
            return res.status(500).json({
                success: false,
                error: "Failed to generate explanation",
                statusCode: 500,
            });
        }
        res.status(200).json({
            success: true,
            message: "Provided explanation",
            data: {
                explanation: explanation
            }
        })


    } catch (error) {
        next(error)
    }
}
export const generateSummary = async (req, res, next) => {
    try {
        // 1️⃣ Extract documentId correctly
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Provide documentId",
                statusCode: 400,
            });
        }

        // 2️⃣ Fetch document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statusCode: 404,
            });
        }

        // 3️⃣ Generate summary
        const summary = await geminiService.generateSummary(
            document.extractedText
        );

        if (!summary) {
            return res.status(500).json({
                success: false,
                error: "Failed to generate summary",
                statusCode: 500,
            });
        }

        // 4️⃣ Send response
        res.status(200).json({
            success: true,
            message: "Document summary generated",

            data: {
                title: document.title,
                summary,

            },
        });
    } catch (error) {
        next(error);
    }
};


export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body;

        // 1️⃣ Validate input
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Provide documentId",
                statusCode: 400,
            });
        }

        // 2️⃣ Fetch document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready",
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statusCode: 404,
            });
        }

        // 3️⃣ Generate quiz using Gemini
        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        console.log(`${questions}, question length: ${questions.length}`)
        // 4️⃣ Save quiz
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0,
        });

        // 5️⃣ Response
        res.status(201).json({
            success: true,
            message: "Quiz generated successfully",
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};
