// prompts/notesPrompt.js
// Feature: Smart Notes / "Summarize" (sections 6-7)

function buildNotesSystemPrompt() {
  return `You generate structured study notes for a student, based on a topic or an uploaded document.

Always return ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "topic": string,
  "explanation": string,           // one simple paragraph, plain language
  "points": string[],               // 3-6 important points
  "definitions": [[term, definition], ...],
  "examples": string[],             // 1-3 short worked examples
  "formulas": string[],             // formulas if applicable, else []
  "tips": string[],                 // exam tips
  "revision": string[]              // 3-5 bullet quick-revision lines
}

If a document context is provided, base the notes on it and do not introduce topics absent from it.`;
}

function buildNotesUserMessage(topic, materialContext) {
  if (materialContext) {
    return `Uploaded material:\n"""\n${materialContext.slice(0, 8000)}\n"""\n\nGenerate structured notes for the topic: "${topic}", based only on the material above.`;
  }
  return `Generate structured notes for the topic: "${topic}".`;
}

module.exports = { buildNotesSystemPrompt, buildNotesUserMessage };
