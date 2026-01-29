import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";

function Chat({ id }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch chat history
    useEffect(() => {
        if (!id) return;

        const fetchChatHistory = async () => {
            try {
                const res = await aiService.getchatHistory(id);
                setChatHistory(res.data?.messages || []);
            } catch (error) {
                toast.error("Failed to fetch chat history");
                console.log(error)
            }
        };

        fetchChatHistory();
    }, [id]);

    // 🔹 Send message
    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please enter a question");
            return;
        }

        try {
            setLoading(true);

            const res = await aiService.chat(id, message);

            setChatHistory(prev => [
                ...prev,
                { role: "user", content: message },
                { role: "assistant", content: res.data.answer }
            ]);

            setMessage("");
        } catch (error) {
            console.error(error);
            toast.error(error.error || "Chat failed");
        } finally {
            setLoading(false);
        }
    };
    function formatAIResponse(text) {
        if (!text || typeof text !== "string") return "";

        let formatted = text;

        // 1️⃣ Ensure spacing before numbered sections
        formatted = formatted.replace(
            /(\n|^)(\d+)\.\s+\*\*(.*?)\*\*/g,
            "\n\n$2. **$3**"
        );

        // 2️⃣ Convert **Heading:** into proper section headings
        formatted = formatted.replace(
            /\*\*(.*?)\:\*\*/g,
            "\n\n## $1\n"
        );

        // 3️⃣ Convert remaining bold titles into sub-headings
        formatted = formatted.replace(
            /\*\*(.*?)\*\*/g,
            "**$1**"
        );

        // 4️⃣ Normalize bullet points
        formatted = formatted.replace(/\* /g, "\n- ");

        // 5️⃣ Improve spacing
        formatted = formatted
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        return formatted;
    }


   return (
    <div className="h-[75vh] flex flex-col bg-white rounded-2xl border shadow-sm">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

            {chatHistory.length === 0 && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-sm text-emerald-700">
                    <span className="text-lg">🤖</span>
                    Ask questions from the document
                </div>
            )}

            {chatHistory.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] shadow-sm
                            ${msg.role === "user"
                                ? "bg-emerald-600 text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                            }`}
                    >
                        <pre className="whitespace-pre-wrap font-sans">
                            {formatAIResponse(msg.content)}
                        </pre>
                    </div>
                </div>
            ))}
        </div>

        {/* Input */}
        <div className="border-t px-4 py-3 flex items-center gap-3 bg-gray-50">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about this document..."
                className="flex-1 px-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
                onClick={handleSend}
                disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50"
            >
                {loading ? "Thinking..." : "Send"}
            </button>
        </div>

    </div>
);

}

export default Chat;
