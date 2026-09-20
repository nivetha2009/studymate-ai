// prompts/examQuestionsPrompt.js
// Feature: "Exam Questions" action on a material card (section 6) — longer-form,
// exam-paper-style questions rather than quick MCQs.

function buildExamQuestionsSystemPrompt() {
  return `You generate exam-paper-style practice questions (short-answer and numerical, not just MCQ) for a student,
based on a subject/topic or uploaded material.

Always return ONLY valid JSON (no markdown fences, no commentary):
{
  "questions": [
    { "type": "short_answer" | "numerical" | "case_study", "q": string, "marks": number, "modelAnswer": string }
  ]
}

Rules:
- Mirror the style and difficulty of real exam papers for this subject.
- If document context is provided, base questions on it and do not introduce unrelated topics.
- modelAnswer should be a concise ideal answer, not a full essay.`;
}

function buildExamQuestionsUserMessage({ subject, topic, count = 5, materialContext }) {
  const contextBlock = materialContext
    ? `Uploaded material context:\n"""\n${materialContext.slice(0, 8000)}\n"""\n\n`
    : '';
  return `${contextBlock}Generate ${count} exam-style questions for subject "${subject}", topic "${topic}".`;
}

module.exports = { buildExamQuestionsSystemPrompt, buildExamQuestionsUserMessage };
