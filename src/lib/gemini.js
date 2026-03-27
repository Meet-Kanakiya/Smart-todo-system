// Mocked Gemini helper (client-side mock).
// IMPORTANT: For real Gemini/OpenAI usage, call the model from a secure server-side endpoint.
// Never embed your real API key directly in client-side code.
//
// This file includes:
// - mockSuggest(text): returns a synthetic study plan string (simulates model output)
// - Example comments showing where to make a real call.

export async function mockSuggest(text){
  // Simulate thinking delay
  await new Promise(res=>setTimeout(res, 700));
  // Very simple heuristic-based suggestion (mock)
  return `Suggested study plan for: ${text}\n\n1) Prioritize topics with nearest deadlines.\n2) Use 25min Pomodoro sessions per topic (4 sessions = 2 hours).\n3) Day 1: Theory - Day 2: Practice problems - Day 3: Revision & Mock test.\n4) Allocate 30% time to weak topics.\n5) Short checklist: Create summaries, attempt 10 problems, review mistakes.\n\n(Replace this mock with a real Gemini call from a server.)`;
}

/*
Example of server-side call (pseudo):

POST /api/gemini
Body: { prompt: "Suggest study plan ..." }
Server uses secure key and calls Gemini/OpenAI, then returns response to client.

Client fetch:
const res = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify({prompt: text}) });
*/
