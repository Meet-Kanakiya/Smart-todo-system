Gemini (or OpenAI) integration
------------------------------
This project includes a client-side MOCK for Gemini suggestions (src/lib/gemini.js).
For production:
1. Create a server endpoint (Node/Express or Cloud Function) that calls Gemini/OpenAI with your secret key.
2. The server endpoint should accept a prompt and return the model's generated text.
3. From the React app, call that server endpoint (fetch) to get real suggestions.

Do NOT place API keys in client-side code.
