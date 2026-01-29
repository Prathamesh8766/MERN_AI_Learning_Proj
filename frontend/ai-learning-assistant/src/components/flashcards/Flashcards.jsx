import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import Spinner from "../common/Spinner";
import Button from "../../components/common/Button"
import aiService from "../../services/aiService";

import { Brain, BookOpen, Trash2 } from "lucide-react";

function Flashcards({ id }) {
  const [flashcards, setFlashcards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fetch flashcards by document ID
  const fetchFlashcards = async () => {
    try {
      const res = await flashcardService.getFlashcardsById(id);
      console.log("FLASHCARD RESPONSE 👉", res);
      setFlashcards(res);
    } catch (error) {
      toast.error("Failed to fetch flashcards");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFlashcards();
  }, [id]);

  // 🔹 Generate flashcards
  const handleGenerateFlashcards = async () => {
    try {
      setGenerating(true);

      const option = 3
      await aiService.generateFlashcards(id, option);

      toast.success("Flashcards generated successfully");
      fetchFlashcards();
    } catch (error) {
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  // 🔹 Delete flashcard set
  const handleDelete = async (e, flashcardId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this flashcard set?")) return;

    try {
      await flashcardService.deleteFlashcardSet(flashcardId);
      setFlashcards((prev) => ({
        ...prev,
        data: prev.data.filter((f) => f._id !== flashcardId),
        count: prev.count - 1,
      }));
      toast.success("Flashcard set deleted");
    } catch {
      toast.error("Failed to delete flashcard set");
    }
  };

  if (loading) return <Spinner />;

  const flashcardList = flashcards?.data || [];

  return (
    <div className="h-[70vh] overflow-y-auto px-6 py-4">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <h1 className="text-2xl font-bold text-gray-900">
              Flashcards
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-8">
            {flashcards?.count || 0} flashcard set
            {flashcards?.count !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Generate button (only when flashcards exist) */}
        {flashcardList.length > 0 && (
          <Button
            onClick={handleGenerateFlashcards}
            className="
      px-5 py-2
      bg-emerald-600 text-white
      rounded-xl shadow
      hover:bg-emerald-700
      disabled:opacity-50
    "
          >
            {generating ? "Generating..." : "✨ Generate Flashcards"}
          </Button>
        )}

      </div>

      <div className="border-b border-gray-200 mb-6" />

      {/* EMPTY STATE */}
      {flashcardList.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <Brain size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Flashcards Yet
          </h2>

          <p className="text-gray-500 max-w-md mb-6">
            Generate flashcards from this document to start learning
            actively and reinforce your knowledge.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="
                            px-6 py-3
                            bg-emerald-600 text-white
                            rounded-xl
                            font-medium
                            shadow
                            hover:bg-emerald-700
                            transition
                            disabled:opacity-50
                        "
          >
            {generating ? "Generating..." : "✨ Generate Flashcards"}
          </button>
        </div>
      )}

      {/* FLASHCARD GRID */}
      {flashcardList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardList.map((card) => {
            const totalCards =
              card.cards?.length || card.totalCards || 0;

            return (
              <div
                key={card._id}
                onClick={() => navigate(`/flashcards/${card._id}`)}
                className="
            relative cursor-pointer
            bg-white
            rounded-2xl
            border-2 border-emerald-300
            p-5
            transition
            hover:shadow-sm
          "
              >
                {/* Delete icon */}
                <button
                  onClick={(e) => handleDelete(e, card._id)}
                  className="
              absolute top-4 right-4
              w-8 h-8
              flex items-center justify-center
              rounded-full
              bg-red-50
              text-red-500
              hover:bg-red-100
            "
                >
                  <Trash2 size={14} />
                </button>

                {/* Icon */}
                <div className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            bg-emerald-100
            text-emerald-600
            mb-4
          ">
                  <BookOpen size={16} />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm">
                  {card.documentId?.title || "Flashcard Set"}
                </h3>

                {/* Date */}
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                  Created {new Date(card.createdAt).toDateString()}
                </p>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200" />

                {/* Cards count */}
                <span className="
            inline-block
            px-3 py-1
            text-xs font-medium
            rounded-lg
            bg-emerald-100
            text-emerald-700
          ">
                  {totalCards} cards
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default Flashcards;
