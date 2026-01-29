import { useEffect, useState } from "react";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import toast from "react-hot-toast";

const ExplainModal = ({ documentId, concept, onClose }) => {
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExplanation = async () => {
            try {
                const res = await aiService.explainConcept(documentId, concept);
                setExplanation(res.data.explanation);
            } catch {
                toast.error("Failed to explain concept");
            } finally {
                setLoading(false);
            }
        };
        fetchExplanation();
    }, [documentId, concept]);


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        🧠 Explanation: {concept}
                    </h2>
                    <button onClick={onClose} className="text-gray-500">✖</button>
                </div>

                {loading ? (
                    <Spinner />
                ) : (
                    <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
                )}
            </div>
        </div>
    );
};

export default ExplainModal;
