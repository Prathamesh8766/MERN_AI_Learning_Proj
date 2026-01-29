import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generate flashcards
 */
export const generateFlashcards = async (text, count = 3) => {
  const prompt = `
Generate exactly ${count} educational flashcards.

Format STRICTLY as:
Q: Question
A: Answer
D: easy | medium | hard

Separate flashcards using ___

Text:
${text.substring(0, 3000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    const flashcards = [];

    const blocks = output.split("___").filter(Boolean);

    for (const block of blocks) {
      let question = "";
      let answer = "";
      let difficulty = "medium";

      for (const line of block.split("\n")) {
        const t = line.trim();

        if (t.startsWith("Q:")) question = t.slice(2).trim();
        if (t.startsWith("A:")) answer = t.slice(2).trim();
        if (t.startsWith("D:")) {
          const d = t.slice(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(d)) difficulty = d;
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (err) {
    console.error("Gemini Flashcard Error:", err);
    throw new Error("Flashcard generation failed");
  }
};

/**
 * Generate quiz questions
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `
Generate exactly ${numQuestions} multiple-choice questions.

Format:
Q: Question
O1: Option 1
O2: Option 2
O3: Option 3
O4: Option 4
C: Correct option text
E: Explanation
D: Difficulty (easy | medium | hard)

Separate questions with ___

Text:
${text.substring(0, 15000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    const quizzes = [];
    const blocks = generatedText.split("___").filter(Boolean);

    for (const block of blocks) {
      const lines = block.split("\n");

      let question = "";
      let options = [];
      let correctAnswer = "";
      let explanation = "";
      let difficulty = "medium";

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith("Q:")) {
          question = trimmed.substring(2).trim();
        } else if (/^O\d:/.test(trimmed)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith("C:")) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("E:")) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("D:")) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        quizzes.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }
    console.log(quizzes)
    return quizzes.slice(0, numQuestions);
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to generate quiz");
  }
};

/**
 * Generate summary
 */
export const generateSummary = async (text) => {
  const prompt = `
Provide a concise and structured summary of the following text.

Text:
${text.substring(0, 1500)}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to generate summary");
  }
};

/**
 * Chat with document context
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `
Use the context below to answer the question.
If the answer is not in the context, say so.

Context:
${context}

Question: ${question}
Answer:
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Chat failed");
  }
};

/**
 * Explain a concept
 */
export const explainConcept = async (concept, context) => {
  const prompt = `
Explain the concept "${concept}" using the context below.
Make it clear and easy to understand.

Context:
${context.substring(0, 10000)}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to explain concept");
  }
};


