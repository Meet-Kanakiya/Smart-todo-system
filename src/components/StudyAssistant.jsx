import React, { useState } from "react";
import "../css/StudyAssistant.css"
const StudyAssistant = ({ apiUrl }) => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAskAI = async () => {
        if (!input) return;

        setLoading(true);

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a helpful study assistant. Answer this: ${input}`,
                                },
                            ],
                        },
                    ],
                }),
            });

            const data = await res.json();
            const answer =
                data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

            setResponse(answer);
        } catch (error) {
            setResponse("Error fetching AI response");
        }

        setLoading(false);
    };

    return (
        <div className="assistant-container">
            <h2 className="title">🤖 Study Assistant</h2>

            <textarea
                placeholder="Ask your study doubt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-box"
            />

            <button onClick={handleAskAI} className="btn">
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            {response && (
                <div className="response-box">
                    <h4>AI Answer:</h4>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default StudyAssistant;