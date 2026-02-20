import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Content from "../../components/documents/DocumentContent";
import Chat from "../../components/documents/Chat";
import SummaryModal from "../../components/documents/SummaryModal";
import ExplainModal from "../../components/documents/ExplainModal";
import Flashcard from "../../components/flashcards/Flashcards";


const tabs = ["content", "chat", "ai action", "flashcards", "quizzes"];

function DocumentDetailPage() {
    const [activeTab, setActiveTab] = useState("content");
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showSummary, setShowSummary] = useState(false);
    const [showExplain, setShowExplain] = useState(false);
    const [concept, setConcept] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const res = await documentService.getDocumentByID(id);
                setDocument(res.data);
            } catch (error) {
                toast.error("Failed to fetch document");
                console.error(error)
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    if (loading || !document) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
                <button
                    className="text-sm text-gray-600 hover:text-emerald-600"
                    onClick={() => navigate("/documents")}
                >
                    ← Back to Documents
                </button>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                {document.title}
            </h1>

            {/* Tabs */}
            <div className="flex gap-6 bg-white px-6 py-3 rounded-xl shadow mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize text-sm font-medium pb-2 ${activeTab === tab
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow p-4">
                {activeTab === "content" && (
                    <Content
                        filePath={document.filePath}
                        fileName={document.fileName}
                        loading={loading}
                    />
                )}

                {activeTab === "chat" && <Chat id={id} />}

                {activeTab === "ai action" && (
                    <div className="h-[70vh] overflow-y-auto px-6 py-4">
                        {/* AI Assistant Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✨</span>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    AI Assistant
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 ml-8">
                                Powered by advanced AI
                            </p>
                            <div className="mt-4 border-b border-gray-200" />
                        </div>

                        {/* Generate Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    📘
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Generate Summary
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Get a concise summary of the entire document.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSummary(true)}
                                className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 transition"
                            >
                                Summarize
                            </button>
                        </div>

                        {/* Explain Concept Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                                    💡
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Explain a Concept
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Enter a topic or concept from the document to get a
                                        detailed explanation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="e.g. React Hooks"
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={() => {
                                        if (!concept.trim()) {
                                            toast.error("Enter a concept first");
                                            return;
                                        }
                                        setShowExplain(true);
                                    }}
                                    className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition"
                                >
                                    Explain
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "flashcards" &&(<Flashcard id ={ document._id}></Flashcard>)}

            </div>

            {/* AI Modals */}
            {showSummary && (
                <SummaryModal
                    documentId={id}
                    onClose={() => setShowSummary(false)}
                />
            )}

            {showExplain && (
                <ExplainModal
                    documentId={id}
                    concept={concept}
                    onClose={() => setShowExplain(false)}
                />
            )}
        </div>
    );
}

export default DocumentDetailPage;
