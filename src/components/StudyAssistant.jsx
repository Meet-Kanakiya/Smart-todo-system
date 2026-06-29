import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "../css/StudyAssistant.css"
const StudyAssistant = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAskAI = async () => {
        if (!input) return;

        setLoading(true);

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemma-4-31b-it:free",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful study assistant."
                        },
                        {
                            role: "user",
                            content: input
                        }
                    ]
                })
            });

            // console.log("Status:", res.status);

            const data = await res.json();

            // console.log(JSON.stringify(data, null, 2));

            if (!res.ok) {
                throw new Error(data.error?.message || "API Error");
            }

            setResponse(data.choices[0].message.content);
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {response}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default StudyAssistant;