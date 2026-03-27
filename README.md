# Smart To-Do & Study Planner

This is a runnable React (v18) + Firebase project scaffold with:
- Authentication (Firebase)
- To-Do tasks (Firestore)
- Planner (simple calendar view)
- Pomodoro timer
- Notes + File upload (Firebase Storage)
- Groups (basic)
- Mocked Gemini AI suggestions (client-side mock + example of server call)
- Sample Firebase config file (replace with your project values)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Replace firebase config in `src/firebase.js` with your credentials or keep sample for testing.

3. Start:
   ```bash
   npm start
   ```

Notes:
- This scaffold uses client-side Firebase and a **mocked** Gemini helper inside `src/lib/gemini.js`.
- To integrate real Gemini API, follow the comments inside `src/lib/gemini.js` and prefer a server-side proxy (to keep keys secret).
