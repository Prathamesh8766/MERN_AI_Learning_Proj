import { useEffect, useState } from "react";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import toast from "react-hot-toast";

const SummaryModal = ({ documentId, onClose }) => {
    const [summary, setSummary] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            console.log(documentId)
            try {
                const res = await aiService.generateSummary(documentId);

                // ✅ HANDLE OBJECT RESPONSE
                setTitle(res.title);
                setSummary(res.summary);
                console.log(summary)
                console.log(title)

            } catch (error) {
                toast.error("Failed to generate summary");
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [documentId]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        📄 {title || "Document Summary"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500">✖</button>
                </div>

                {loading ? (
                    <Spinner />
                ) : (
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {summary}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SummaryModal;
