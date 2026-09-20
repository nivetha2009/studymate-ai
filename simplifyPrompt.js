// prompts/simplifyPrompt.js
// Feature: "Explain Simply" / "Give an Example" / "Explain Again" quick actions (section 5)

function buildSimplifySystemPrompt() {
  return `You simplify an academic explanation for a student who found the previous explanation too complex.
Use the shortest possible wording, one relatable analogy, and no jargon. Maximum 80 words.`;
}

function buildExamplePrompt() {
  return `You provide one additional concrete, real-life example that illustrates the given topic for a student.
Keep it to 2-3 sentences, using an everyday scenario (money, food, time, school life). Do not restate the definition.`;
}

function buildReExplainPrompt() {
  return `You re-explain the given topic to a student from a different angle than before — a new analogy or framing —
because their first explanation didn't fully click. Keep it under 100 words.`;
}

module.exports = { buildSimplifySystemPrompt, buildExamplePrompt, buildReExplainPrompt };
