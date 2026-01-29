export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/getprofile",
    UPDATE_PROFILE: "/api/auth/updateprofile",
    CHANGE_PASSWORD: "/api/auth/changepassword",
  },

  DOCUMENT: {
    UPLOAD: "/api/document/upload",
    GET_ALL: "/api/document",
    GET_BY_ID: (id) => `/api/document/${id}`,
    DELETE: (id) => `/api/document/delete/${id}`,
  },

  FLASHCARD: {
    GET_BY_DOCUMENT: (documentId) => `/api/flashcard/${documentId}`,
    GET_ALL: "/api/flashcard",
    DELETE_SET: (id) => `/api/flashcard/${id}`,
    REVIEW_CARD: (cardId) => `/api/flashcard/${cardId}/review`,
    TOGGLE_STAR: (cardId) => `/api/flashcard/${cardId}/start`,
  },

  AI: {
    GENERATE_FLASHCARDS: "/api/ai/genreter/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/genreter/generate-quize",
    GENERATE_SUMMARY: "/api/ai/genreter/generate-summary",
    EXPLAIN_CONCEPT: "/api/ai/genreter/explain-concept",
    CHAT: "/api/ai/genreter/chat",
    CHAT_HISTORY: "/api/ai/genreter/generate-history",
  },

  QUIZ: {
    GET_BY_DOCUMENT: (documentId) => `/api/quizzes/${documentId}`,
    GET_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
    SUBMIT: (id) => `/api/quizzes/${id}/submit`,
    RESULT: (id) => `/api/quizzes/${id}/result`,
    DELETE: (id) => `/api/quizzes/${id}`,
  },

  DASHBOARD: {
    GET_DASHBOARD: "api/dashboard",
  },
};
