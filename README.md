# StudyMate AI — Backend / API Layer

This is the backend/API layer for **StudyMate AI**. It sits between the frontend
and the Anthropic Claude API so the API key is never exposed to the browser:

```
Student → Frontend → Backend/API (this project) → Claude API → Backend → Frontend → Student
```

## 1. Project structure

```
backend/
  server.js                 # Express app entry point, mounts all routes
  package.json
  .env.example               # copy to .env and fill in your key
  routes/
    tutor.js                 # POST /api/tutor, /api/tutor/simplify, /example, /explain-again
    notes.js                 # POST /api/notes            (Smart Notes / Summarize)
    quiz.js                  # POST /api/quiz             (MCQ + HOTS generation)
    flashcards.js             # POST /api/flashcards
    examQuestions.js          # POST /api/exam-questions
    studyPlan.js              # POST /api/study-plan       (Exam Mode)
    progress.js               # POST /api/progress/analyze (weak-topic recommendations)
    materials.js               # GET/POST /api/materials, /api/materials/upload
  prompts/                    # one modular prompt-builder file per AI feature
    tutorPrompt.js
    simplifyPrompt.js
    notesPrompt.js
    mcqPrompt.js
    hotsPrompt.js
    flashcardPrompt.js
    examQuestionsPrompt.js
    studyPlanPrompt.js
    weakTopicAnalysisPrompt.js
  middleware/
    errorHandler.js           # turns internal errors into calm, student-facing messages
    upload.js                 # multer config for PDF/PPT/PPTX/DOC/DOCX/TXT uploads
  utils/
    claudeClient.js            # single wrapped Anthropic SDK client (reads ANTHROPIC_API_KEY)
    parseJson.js                # strips markdown fences + validates structured AI JSON output
  uploads/                     # uploaded files land here (gitignored)
```

Each Claude feature (AI Tutor, Notes, MCQs, HOTS, Flashcards, Exam Questions, Study Plan,
Weak Topic Analysis) has its **own prompt file and its own route** — nothing shares one
giant prompt, so any feature's wording can be tuned independently.

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...      # from https://console.anthropic.com
CLAUDE_MODEL=claude-sonnet-4-6
PORT=8787
ALLOWED_ORIGINS=http://localhost:5173
```

**Never commit `.env` or put the API key in any frontend file.** The key is read only
in `utils/claudeClient.js`, on the server.

## 3. Run locally

```bash
npm run dev      # with nodemon, auto-restarts on change
# or
npm start
```

The API is now live at `http://localhost:8787`. Check it with:

```bash
curl http://localhost:8787/api/health
```

## 4. Wiring up the frontend

The shipped frontend (`studymate.html`) runs entirely in **Demo Mode** — every "AI"
response comes from local mock logic in the `DemoAI` object, clearly commented with
`// CONNECT REAL API` at each call site (in the AI Tutor send handler, the quiz
generator, the flashcard generator, and the study-plan generator).

To go live, replace each `DemoAI.xxx(...)` call with a `fetch` to the matching
endpoint below, and keep everything else (rendering, state, UI) unchanged:

| Feature | Demo call | Real endpoint |
|---|---|---|
| AI Tutor | `DemoAI.tutorReply(...)` | `POST /api/tutor` `{ question, materialContext }` |
| Explain Simply | `DemoAI.simplify(...)` | `POST /api/tutor/simplify` `{ topic, previousExplanation }` |
| Give an Example | `DemoAI.giveExample(...)` | `POST /api/tutor/example` `{ topic }` |
| Explain Again | `DemoAI.explainAgain(...)` | `POST /api/tutor/explain-again` `{ topic }` |
| Smart Notes | `DemoAI.notesFor(...)` | `POST /api/notes` `{ topic, materialContext }` |
| Quiz Arena (MCQ/True-False) | `DemoAI.makeQuiz(...)` | `POST /api/quiz` `{ subject, topic, difficulty, count, questionType, materialContext }` |
| HOTS Mode | same endpoint, `difficulty: "HOTS"` | `POST /api/quiz` |
| Flashcards | `DemoAI.makeFlashcards(...)` | `POST /api/flashcards` `{ topic, count, materialContext }` |
| Exam Questions (material card action) | — | `POST /api/exam-questions` `{ subject, topic, count, materialContext }` |
| Exam Mode / Study Planner | `DemoAI.makePlan(...)` | `POST /api/study-plan` `{ subject, examDate, hoursPerDay, level, topics, weakTopics }` |
| Weak-topic recommendations | hand-written string in Progress Tracker | `POST /api/progress/analyze` `{ ...student activity data... }` |
| Upload a material | local `<input type="file">` only | `POST /api/materials/upload` (multipart, field `file`) then `GET /api/materials` |

Example fetch, replacing the tutor's demo call:

```javascript
async function askTutor(question, materialContext) {
  const res = await fetch('http://localhost:8787/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, materialContext }),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Something went wrong. Please try again.');
  }
  const { text } = await res.json();
  return text;
}
```

## 5. Switching between Demo Mode and real Claude API mode

- **Demo Mode (default, ships as-is):** the frontend needs no backend at all — every
  page works from `DemoAI` mock data. This is what's published/shared right now.
- **Real API mode:** deploy this `backend/` project (Render, Railway, Fly.io, a VM, etc.),
  set `ANTHROPIC_API_KEY` there as an environment variable, then update the frontend's
  `CONNECT REAL API` call sites to `fetch()` the deployed backend URL instead of calling
  `DemoAI`. No other frontend code needs to change — the JSON shapes already match.
- Keeping the two modes separate (rather than interleaving `fetch` calls throughout the
  UI code) means you can flip a single flag/base-URL constant later instead of rewriting
  the frontend.

## 6. Structured output & error handling

- Every JSON-producing feature's prompt instructs Claude to return **only JSON, no
  markdown fences** (`prompts/*.js`).
- `utils/parseJson.js` strips any stray fences and throws a clear, catchable error if
  parsing still fails or required fields are missing.
- `middleware/errorHandler.js` turns any failure (bad JSON, expired key, rate limit,
  network error) into one of the calm, non-technical messages specified in the brief —
  e.g. *"Sorry, StudyMate AI is temporarily unavailable. Please try again."* No API keys
  or stack traces are ever sent to the client.

## 7. Known limitations / what still needs real implementation

- **Text extraction from uploads** is stubbed in `middleware/upload.js#extractText`.
  Wire in `pdf-parse` (PDF), `mammoth` (DOCX), or `officeparser` (PPT/PPTX) to turn an
  uploaded file into the `materialContext` string used everywhere above.
- **Persistence** is in-memory (`routes/materials.js`) and resets on server restart —
  swap in a real database keyed by authenticated student ID for production.
- **Authentication** is not implemented; every route is open. Add an auth middleware
  (JWT/session) before deploying beyond a local demo.
- **Rate limiting** is a simple in-memory limiter suitable for a single server instance;
  use a shared store (Redis) behind a load balancer.
- **Streaming** responses (token-by-token) are not implemented — each route waits for
  the full Claude response. Optional enhancement: use the Anthropic SDK's streaming
  mode and Server-Sent Events for a livelier "typing" effect in the AI Tutor.
