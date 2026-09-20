// prompts/flashcardPrompt.js
// Feature: Smart Flashcards (section 10)

function buildFlashcardSystemPrompt() {
  return `You generate flashcards for a student studying a topic or document.

Always return ONLY valid JSON (no markdown fences, no commentary) as an array:
[
  { "front": string, "back": string },
  ...
]

Rules:
- "front" should be a short question or term (under 15 words).
- "back" should be a concise, accurate answer (under 40 words).
- Avoid duplicating the same concept across cards in one batch.
- If document context is provided, base cards only on it.`;
}

function buildFlashcardUserMessage({ topic, count, materialContext }) {
  const contextBlock = materialContext
    ? `Uploaded material context:\n"""\n${materialContext.slice(0, 8000)}\n"""\n\n`
    : '';
  return `${contextBlock}Generate ${count} flashcards for the topic: "${topic}".`;
}

module.exports = { buildFlashcardSystemPrompt, buildFlashcardUserMessage };
