// utils/claudeClient.js
// -----------------------------------------------------------------------
// Single place that talks to the Anthropic API. Every feature route calls
// callClaude() with a system prompt (built in prompts/*.js) and a user
// message. The API key lives only here, read from the environment —
// it is never sent to or exposed in the frontend.
// -----------------------------------------------------------------------
const Anthropic = require('@anthropic-ai/sdk');

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '[StudyMate AI] ANTHROPIC_API_KEY is not set. Requests to Claude will fail. ' +
    'Copy .env.example to .env and add your key, or run the frontend in Demo Mode.'
  );
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

/**
 * Calls Claude with a system prompt + user content and returns the
 * concatenated text of the response.
 * @param {string} systemPrompt - feature-specific instructions (see prompts/)
 * @param {string} userMessage - the student's question / generated request
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 * @returns {Promise<string>}
 */
async function callClaude(systemPrompt, userMessage, opts = {}) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens || 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

module.exports = { callClaude, MODEL };
