// prompts/mcqPrompt.js
// Feature: Quiz Arena — standard MCQ / True-False generation (section 8)

function buildMcqSystemPrompt() {
  return `You generate exam-style practice questions for a student.

Always return ONLY valid JSON (no markdown fences, no commentary) as an array of question objects:
[
  {
    "q": string,
    "options": string[],      // exactly 4 for MCQ, exactly 2 ("True","False") for True/False
    "correct": number,        // index into options
    "explain": string         // short explanation of the correct answer
  },
  ...
]

Rules:
- Match the requested difficulty: Easy (recall/definition), Medium (application), Hard (multi-step/numerical), HOTS (see the HOTS prompt module).
- Only test material relevant to the given subject/topic. If document context is provided, base questions on it.
- Do not repeat the same question stem twice in one batch.
- Distractor options must be plausible, not obviously wrong.`;
}

function buildMcqUserMessage({ subject, topic, difficulty, count, questionType, materialContext }) {
  const contextBlock = materialContext
    ? `Uploaded material context (base questions on this):\n"""\n${materialContext.slice(0, 8000)}\n"""\n\n`
    : '';
  return `${contextBlock}Generate ${count} ${questionType} questions for subject "${subject}", topic "${topic}", difficulty "${difficulty}".`;
}

module.exports = { buildMcqSystemPrompt, buildMcqUserMessage };
