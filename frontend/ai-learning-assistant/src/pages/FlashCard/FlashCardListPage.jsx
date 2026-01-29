import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";

import {
    BookOpen,
    TrendingUp,
} from "lucide-react";

function FlashCardListPage() {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🔹 Fetch flashcards
    const fetchFlashcards = async () => {
        try {
            const res = await flashcardService.getAllFlashcardSets();
            console.log("FLASHCARDS ARRAY 👉", res);
            setFlashcards(res || []);
        } catch (error) {
            toast.error("Failed to fetch flashcards");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, []);

    if (loading) return <Spinner />;

    if (!flashcards.length) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-500 gap-2">
                <TrendingUp size={32} />
                <p>No flashcard sets available</p>
            </div>
        );
    }

    const formatDateTime = (date) =>
        new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="h-full bg-neutral-200/60 p-6 flex flex-col">
            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Flashcards</h1>
                <p className="text-neutral-500">
                    All your generated flashcard sets
                </p>
            </div>

            {/* GRID */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {flashcards.map((set) => {
                        const totalCards = set.cards.length;
                        const reviewedCards = set.cards.filter(c => c.reviewCount > 0).length;
                        const progressPercent = totalCards
                            ? Math.round((reviewedCards / totalCards) * 100)
                            : 0;

                        return (
                            <div
                                key={set._id}
                                onClick={() => navigate(`/flashcards/${set._id}`)}
                                className="
                                    bg-white rounded-2xl
                                    border border-emerald-200
                                    p-6
                                    shadow-sm
                                    hover:shadow-xl
                                    hover:border-emerald-400
                                    hover:ring-2 hover:ring-emerald-200
                                    transition-all duration-300
                                    cursor-pointer
                                    flex flex-col gap-6
                                    min-h-[360px]
                                "
                            >
                                {/* HEADER */}
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <BookOpen size={20} />
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-base font-semibold text-gray-800 leading-snug">
                                            {set.documentId?.title || "Flashcard Set"}
                                        </h2>
                                        <p className="text-xs uppercase tracking-wide text-gray-400 mt-1">
                                            Created {formatDateTime(set.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* CARDS + PERCENTAGE */}
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex px-4 py-1.5 text-sm rounded-full border text-gray-700">
                                        {totalCards} Cards
                                    </span>

                                    <span className="
                                        inline-flex items-center gap-1
                                        px-3 py-1
                                        rounded-full
                                        bg-emerald-100
                                        text-emerald-700
                                        text-sm font-semibold
                                    ">
                                        <TrendingUp size={14} />
                                        {progressPercent}%
                                    </span>
                                </div>

                                {/* PROGRESS */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Progress</span>
                                        <span>{reviewedCards}/{totalCards} reviewed</span>
                                    </div>

                                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {/* DIVIDER */}
                                <hr className="my-2 mx-1 border-t border-gray-200" />

                                {/* CTA */}
                                <button
                                    className="
                                        w-full
                                        py-2.5 rounded-xl
                                        bg-emerald-100 text-emerald-700
                                        text-sm font-semibold
                                        hover:bg-emerald-200
                                        transition
                                        flex items-center justify-center gap-2
                                    "
                                >
                                    <span className="text-emerald-600">✨</span>
                                    Study Now
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FlashCardListPage;
