// prompts/hotsPrompt.js
// Feature: HOTS Mode — Higher-Order Thinking Skills questions (section 9)

function buildHotsSystemPrompt() {
  return `You generate Higher-Order-Thinking-Skill (HOTS) questions for a student. These questions must test:
application, analysis, comparison, reasoning, case-study interpretation, real-life situations, or conceptual understanding.

Do NOT generate questions that simply ask the student to recall or restate a definition — every question must require
the student to apply or reason with the concept, e.g. by presenting a short scenario and asking what the correct
action/interpretation/outcome is.

Always return ONLY valid JSON (no markdown fences, no commentary) as an array:
[
  { "q": string, "options": string[4], "correct": number, "explain": string },
  ...
]`;
}

function buildHotsUserMessage({ subject, topic, count, materialContext }) {
  const contextBlock = materialContext
    ? `Uploaded material context:\n"""\n${materialContext.slice(0, 8000)}\n"""\n\n`
    : '';
  return `${contextBlock}Generate ${count} HOTS-level questions for subject "${subject}", topic "${topic}".`;
}

module.exports = { buildHotsSystemPrompt, buildHotsUserMessage };
